import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

function createPasswordHash(password: string): string {
  const salt = crypto.randomBytes(16);
  const keylen = 64;
  const derived = crypto.scryptSync(password, salt, keylen);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

function writeAuthJson(outPath: string, passwordHash: string) {
  const obj = { passwordHash };
  fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), { encoding: "utf8", flag: "w" });
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    console.log("Usage: ts-node generateHash.ts <password> [outputPath]");
    console.log(" Example: ts-node generateHash.ts superSecret123 ./auth.json");
    process.exit(0);
  }
  const password = argv[0];
  const out = argv[1] ?? path.resolve(process.cwd(), "auth.json");
  if (!password || password.length < 4) {
    console.error("Password required (min length 4).");
    process.exit(2);
  }
  try {
    const ph = createPasswordHash(password);
    writeAuthJson(out, ph);
    console.log(`auth.json written to ${out}`);
    console.log(`Password hash (salt:hash):\n${ph}`);
    console.log(`Add auth.json to .gitignore to avoid committing it.`);
  } catch (err) {
    console.error("Error creating hash:", err);
    process.exit(1);
  }
}
if (require.main === module) {
  main();
}