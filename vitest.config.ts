import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    test: {
        environment: "node",
        globals: true,
        include: ["test/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        exclude: ["**/node_modules/**", "**/*.component.test.tsx"],
    },
});
