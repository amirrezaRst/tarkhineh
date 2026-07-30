const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    reporter: "list",
    use: {
        // The two dev servers (backend :5000, frontend :3000) are expected
        // to already be running — this is a preview config, not a CI one
        // (a real CI setup would use Playwright's `webServer` option to
        // start them automatically before the tests run).
        baseURL: "http://localhost:3000",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                // Playwright's own bundled Chromium download is blocked by a
                // regional CDN restriction in this environment — use the
                // system-installed Chrome instead of Playwright's own binary.
                channel: "chrome",
            },
        },
    ],
});
