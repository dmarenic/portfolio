import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tests run in Node (npm test). "@/..." points to src/, as in tsconfig.json.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
