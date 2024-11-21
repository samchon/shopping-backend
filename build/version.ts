import fs from "fs";

const document = JSON.parse(
  fs.readFileSync(__dirname + "/../packages/api/swagger.json", "utf8")
);
const version = document.info.version;
fs.writeFileSync(
  __dirname + "/../packages/api/version.json",
  JSON.stringify({ version }, null, 2),
  "utf8"
);
