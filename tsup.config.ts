import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react"],
  tsconfig: "tsconfig.build.json",
  // esbuild strips the in-file "use client" directive, so put it back on
  // the bundle. Rollup's treeshake pass would drop the banner again;
  // esbuild still tree-shakes while bundling.
  banner: { js: '"use client";' },
  treeshake: false,
});
