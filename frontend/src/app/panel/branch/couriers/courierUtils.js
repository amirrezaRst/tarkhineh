// Shared courier helpers for the couriers page.
export const VEHICLE_LABEL = { motorcycle: "موتورسیکلت", bicycle: "دوچرخه", car: "خودرو", foot: "پیاده" };

// Absolute URL for a courier photo (image field stored as "couriers/<file>").
export const courierImg = (image) =>
    image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}` : null;

export const initials = (name, phone) => {
    if (name) {
        const p = name.trim().split(/\s+/);
        return (p[0]?.[0] || "") + (p[1]?.[0] || "");
    }
    return phone ? phone.slice(-2) : "؟";
};

// Display status derived from manual availability + live active load.
// offline (manually off) → busy (carrying orders) → free.
export const courierState = (courier) => {
    if (courier.courierStatus === "offline") return "off";
    return courier.activeOrders > 0 ? "busy" : "free";
};

export const STATE_META = {
    free: { label: "آزاد", sub: "آمادهٔ سفارش", ring: "bg-primary", text: "text-primary" },
    busy: { label: "در حال تحویل", sub: "آنلاین", ring: "bg-status-preparing", text: "text-status-preparing" },
    off: { label: "آفلاین", sub: "خارج از دسترس", ring: "bg-border-strong", text: "text-subtle-fg" },
};
