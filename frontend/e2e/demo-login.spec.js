const { test, expect } = require("@playwright/test");

// Proves the actual point of DEMO_MODE: a visitor with no real phone/SMS
// can still complete a real login, end to end, through the real UI.
test("a visitor can register and log in using the on-screen demo OTP", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "ورود / ثبت‌نام" }).click();

    // Scoped to the modal (role="dialog") deliberately: the homepage has
    // other forms/textboxes further down (a franchise/contact form), and an
    // unscoped locator silently grabbed one of those instead of the OTP
    // field the first time this test was written — same class of mistake
    // as the earlier hidden-<li> finding in homepage.spec.js.
    const dialog = page.getByRole("dialog");

    // A fresh, unlikely-to-collide number each run.
    const phone = "0912" + Math.floor(1000000 + Math.random() * 8999999);
    await dialog.getByPlaceholder("شماره موبایل").fill(phone);
    await dialog.getByRole("button", { name: "ادامه" }).click();

    const banner = dialog.getByText("حالت دمو — بدون پیامک واقعی");
    await expect(banner).toBeVisible({ timeout: 15000 });

    // Persian digits in the banner (۰-۹) — same conversion the rest of the
    // app uses for display, so read it back through the same map rather
    // than assuming a fixed format.
    const persianToEnglishDigits = (s) =>
        s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    // Convert Persian digits BEFORE stripping non-digits — \D only
    // recognizes ASCII 0-9, so it would silently strip ۰-۹ too if run first.
    const bannerText = await dialog.getByText(/کد تایید شما:/).textContent();
    const code = persianToEnglishDigits(bannerText).replace(/\D/g, "");
    expect(code).toHaveLength(5);

    await dialog.getByRole("textbox").first().click();
    await page.keyboard.type(code);

    await dialog.getByRole("button", { name: "ثبت کد" }).click();

    // On success the modal closes and the login icon's accessible name
    // switches from the login label to the profile one.
    await expect(page.getByRole("button", { name: "پروفایل من" })).toBeVisible({ timeout: 15000 });
});
