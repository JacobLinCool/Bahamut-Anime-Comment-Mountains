const { spawnSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");

process.stdout.write("Building... ");
spawnSync("npx esbuild --bundle --outdir=dist --minify --target=es6 src/index.js", { shell: true });
process.stdout.write("Done\n");

process.stdout.write("Generating Metadata... ");
const package = require("../package.json");
const metadata = {
    name: package.name
        .split("-")
        .map((x) => x[0].toUpperCase() + x.slice(1))
        .join(" "),
    version: package.version,
    description: package.description,
    author: package.author,
    namespace: "http://tampermonkey.net/",
    match: "https://ani.gamer.com.tw/animeVideo.php?sn=*",
    icon: "https://www.google.com/s2/favicons?domain=gamer.com.tw",
    grant: "none",
};

const header = [
    "==UserScript==",
    ...Object.entries(metadata).map(([k, v]) => `@${k.padEnd(12)} ${v}`),
    "==/UserScript==",
]
    .map((x) => "// " + x)
    .join("\n");
writeFileSync("./dist/index.js", header + "\n\n" + readFileSync("./dist/index.js", "utf8"), "utf8");
process.stdout.write("Done\n");
