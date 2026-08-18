import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function pngSize(relativePath) {
  const image = await readFile(new URL(relativePath, root));
  assert.equal(
    image.subarray(1, 4).toString("ascii"),
    "PNG",
    `${relativePath} must be a PNG`,
  );
  return {
    height: image.readUInt32BE(20),
    width: image.readUInt32BE(16),
  };
}

test("ships Arsenia's generated brand mark instead of the Next.js favicon", async () => {
  await assert.rejects(stat(new URL("src/app/favicon.ico", root)));
  assert.deepEqual(await pngSize("src/app/icon.png"), {
    height: 512,
    width: 512,
  });
  assert.deepEqual(await pngSize("src/app/apple-icon.png"), {
    height: 180,
    width: 180,
  });
});
