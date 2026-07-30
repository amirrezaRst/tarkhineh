const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // These already carry their own <meta name="robots" content="noindex">
            // (see the respective layout.jsx files) — listed here too since a
            // Disallow also stops the crawler from spending budget on them at all.
            disallow: ["/admin", "/panel", "/profile", "/cart", "/payment-status"],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
