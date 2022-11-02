import { copyFile } from "fs";
import { build } from "esbuild";

build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: true,
    outdir: "build",
    platform: "node",
    target: ["node16"],
    format: "cjs",
    external: ["./node_modules/*"],
}).catch((e) => console.error(e));

copyFile("./package.json", "./build/package.json", (e) => {
    if (e) throw e;
});

copyFile("./README.md", "./build/README.md", (e) => {
    if (e) throw e;
});
