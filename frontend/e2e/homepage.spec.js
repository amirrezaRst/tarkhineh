const { test, expect } = require("@playwright/test");

test("homepage loads and shows real branches fetched from the API", async ({ page }) => {
    await page.goto("/");

    // Confirms the metadata work from earlier actually reached the browser.
    await expect(page).toHaveTitle(/ترخینه/);

    // BranchList fetches this from the live backend client-side (not present
    // in the raw server HTML — curl won't see it, a real browser will) — if
    // it shows up, the full chain (browser -> Next.js -> Express -> MongoDB)
    // just worked end to end, not just one layer of it.
    //
    // Found the hard way (this exact locator failed on the first run): a
    // loose getByText("ونک") also matches a closed navbar dropdown's <li>,
    // which sits earlier in the DOM and is hidden. Role + accessible name is
    // more precise here — it targets the actual visible card link, not
    // "anything anywhere containing this text".
    const vanakCard = page.getByRole("link", { name: /شعبه ونک/ });
    await expect(vanakCard).toBeVisible({ timeout: 15000 });
});

test("clicking a branch card navigates to that branch's page", async ({ page }) => {
    await page.goto("/");

    // Second real finding: this link only slides into view on hover
    // (`group-hover:bottom-0`, CSS-animated) and sits over an image overlay
    // that opens a gallery modal on click — a plain .click() landed before
    // the hover transition settled and hit the wrong layer. .hover() first
    // (a real mouse move, not just a state check) gives the transition time
    // to finish, the same way a real user's cursor would.
    const vanakCard = page.getByRole("link", { name: /شعبه ونک/ });
    await vanakCard.hover();
    await vanakCard.click();

    await expect(page).toHaveURL(/branches\?branch=/);
});
