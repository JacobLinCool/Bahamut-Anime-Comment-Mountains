const { spawnSync } = require("child_process");
const { writeFileSync, existsSync, mkdirSync, rmSync, statSync } = require("fs");
const { resolve } = require("path");

const dist = resolve(__dirname, "..", "dist");

process.stdout.write("Removing old dist... ");
if (existsSync(dist)) {
    rmSync(dist, { recursive: true });
}
mkdirSync(dist);
process.stdout.write("Done\n");

process.stdout.write("Building... ");
const { bundled, minified } = build();
process.stdout.write("Done\n");

process.stdout.write("Generating metadata... ");
const header = make_header();
process.stdout.write("Done\n");

process.stdout.write("Writing to dist... ");
writeFileSync(resolve(dist, "index.user.js"), header + "\n\n" + bundled);
writeFileSync(resolve(dist, "index.min.user.js"), header + "\n\n" + minified);
process.stdout.write("Done\n");

console.log("----------------------------------------");
console.log(`Bundled: ${(statSync(resolve(dist, "index.user.js")).size / 1024).toFixed(1)} KB`);
console.log(`Minified: ${(statSync(resolve(dist, "index.min.user.js")).size / 1024).toFixed(1)} KB`);

function build() {
    const bundled = run("npx esbuild --bundle --target=es6 --jsx-factory=h --jsx-fragment=Fragment src/index.js");
    if (bundled.status !== 0) {
        console.error("\n\n" + bundled.stderr.toString());
        process.exit(1);
    }
    const minified = run("npx esbuild --bundle --minify --target=es6 --jsx-factory=h --jsx-fragment=Fragment src/index.js");
    if (minified.status !== 0) {
        console.error("\n\n" + minified.stderr.toString());
        process.exit(1);
    }

    return { bundled: bundled.stdout.toString(), minified: minified.stdout.toString() };
}

function make_header() {
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
        downloadURL: "https://raw.githubusercontent.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/main/dist/index.user.js",
        namespace: "http://tampermonkey.net/",
        match: "https://ani.gamer.com.tw/animeVideo.php?sn=*",
        icon: "https://www.google.com/s2/favicons?domain=gamer.com.tw",
        grant: "none",
    };

    const header = ["==UserScript==", ...Object.entries(metadata).map(([k, v]) => `@${k.padEnd(12)} ${v}`), "==/UserScript=="]
        .map((x) => "// " + x)
        .join("\n");

    return header;
}

function run(command) {
    return spawnSync(command, { shell: true });
}
