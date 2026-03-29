import { writePseoSnapshot } from "@/lib/pseo/snapshot";

async function main() {
  const result = await writePseoSnapshot();

  console.log(
    `Generated pSEO dataset snapshot for ${result.manifest.shard_count} shards at ${result.output_path}.`,
  );
}

main().catch((error) => {
  console.error("Failed to generate pSEO snapshot.");
  console.error(error);
  process.exit(1);
});
