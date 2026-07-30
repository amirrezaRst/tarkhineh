export default function manifest() {
    return {
        name: "ترخینه | سفارش آنلاین غذای سالم و گیاهی",
        short_name: "ترخینه",
        description: "سفارش آنلاین غذای سالم و گیاهی از نزدیک‌ترین شعبه به شما.",
        start_url: "/",
        display: "standalone",
        lang: "fa",
        dir: "rtl",
        background_color: "#fafafa",
        theme_color: "#428057",
        icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };
}
