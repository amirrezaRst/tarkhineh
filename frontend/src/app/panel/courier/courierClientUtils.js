// Shared client helpers for the courier panel.
import PersianNumber from "@/utils/ConvertToPersianNumber";

export const faTime = (date) =>
    date ? new Date(date).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) : "";

export const faDate = (date) =>
    date ? new Date(date).toLocaleDateString("fa-IR", { month: "long", day: "numeric" }) : "";

export const relativeFa = (date) => {
    if (!date) return "";
    const diffMin = Math.round((Date.now() - new Date(date).getTime()) / 60000);
    if (diffMin < 1) return "همین حالا";
    if (diffMin < 60) return `${PersianNumber(diffMin)} دقیقه پیش`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `${PersianNumber(diffH)} ساعت پیش`;
    return `${PersianNumber(Math.round(diffH / 24))} روز پیش`;
};

export const itemsSummary = (items = []) =>
    items.map((it) => `${it.menuItem?.name ?? "؟"} ×${PersianNumber(it.quantity)}`).join(" · ");

export const shortId = (id) => PersianNumber(String(id).slice(-5));

// A Google Maps search link for the delivery address.
export const mapUrl = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "")}`;
