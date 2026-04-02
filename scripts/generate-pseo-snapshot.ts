import { writePseoSnapshot } from "@/lib/pseo/snapshot-write";

async function main() {
  const result = await writePseoSnapshot();

  console.log(
    `Generated pSEO dataset snapshot for ${result.manifest.shard_count} shards at ${result.output_path}.`,
  );
  console.log(
    `Pre-generated ${result.prebaked_shards} core shard page files in ${result.shards_dir}/`,
  );
  console.log(
    `Remaining ${result.manifest.shard_count - result.prebaked_shards} location/translation shards will be generated at runtime.`,
  );
}

main().catch((error) => {
  console.error("Failed to generate pSEO snapshot.");
  console.error(error);
  process.exit(1);
});
