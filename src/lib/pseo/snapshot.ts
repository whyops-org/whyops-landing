import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolvePseoDataset } from "@/lib/pseo/api";
import { buildPseoManifest } from "@/lib/pseo/manifest";
import { getSiteSourceConfig } from "@/lib/pseo/source-config";
import type { NormalizedDataset, PseoManifest } from "@/lib/pseo/types";

type PseoSnapshotContext = {
  version: 1;
  generated_at: string;
  normalized_dataset: NormalizedDataset;
  manifest: PseoManifest;
};

const SNAPSHOT_ROOT = path.join(process.cwd(), "public", "generated", "pseo");
const SNAPSHOT_CONTEXT_PATH = path.join(SNAPSHOT_ROOT, "context.json");

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function loadPseoSnapshotContext(): Promise<PseoSnapshotContext | null> {
  return readJsonFile<PseoSnapshotContext>(SNAPSHOT_CONTEXT_PATH);
}

export async function writePseoSnapshot() {
  const resolved = await resolvePseoDataset(undefined, getSiteSourceConfig());
  const manifest = buildPseoManifest(resolved.normalized_dataset);

  const snapshotContext: PseoSnapshotContext = {
    version: 1,
    generated_at: new Date().toISOString(),
    normalized_dataset: resolved.normalized_dataset,
    manifest,
  };

  await rm(SNAPSHOT_ROOT, { recursive: true, force: true });
  await mkdir(SNAPSHOT_ROOT, { recursive: true });
  await writeFile(SNAPSHOT_CONTEXT_PATH, JSON.stringify(snapshotContext), "utf8");

  return {
    manifest,
    output_path: SNAPSHOT_CONTEXT_PATH,
  };
}
