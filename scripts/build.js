const { spawnSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");

process.stdout.write("Building... ");
spawnSync(
    "npx esbuild --bundle --outdir=dist --minify --target=es6 --jsx-factory=h --jsx-fragment=Fragment src/index.js",
    {
        shell: true,
        stdio: "inherit",
    },
);
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
    license: package.license,
    homepage: package.homepage,
    supportURL: package.bugs.url,
    updateURL: "https://raw.githubusercontent.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/main/dist/index.user.js",
    downloadURL:
        "https://raw.githubusercontent.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/main/dist/index.user.js",
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
writeFileSync("./dist/index.user.js", header + "\n\n" + readFileSync("./dist/index.js", "utf8"), "utf8");
process.stdout.write("Done\n");
