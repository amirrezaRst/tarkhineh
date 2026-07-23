// Shared formatting helpers for the orders list + detail panel.
import PersianNumber from "@/utils/ConvertToPersianNumber";

// HH:MM in Persian digits (Tehran locale renders Persian numerals already).
export const faTime = (date) =>
    date ? new Date(date).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) : "";

// Short human "… ago" label from a timestamp.
export const relativeFa = (date) => {
    if (!date) return "";
    const diffMin = Math.round((Date.now() - new Date(date).getTime()) / 60000);
    if (diffMin < 1) return "همین حالا";
    if (diffMin < 60) return `${PersianNumber(diffMin)} دقیقه پیش`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `${PersianNumber(diffH)} ساعت پیش`;
    const diffD = Math.round(diffH / 24);
    return `${PersianNumber(diffD)} روز پیش`;
};

// "قورمه سبزی ×۲ · بورانی بادمجان ×۱"
export const itemsSummary = (items = []) =>
    items.map((it) => `${it.menuItem?.name ?? "؟"} ×${PersianNumber(it.quantity)}`).join(" · ");

// Last 5 chars of the Mongo id, as a friendly order number.
export const shortId = (id) => PersianNumber(String(id).slice(-5));

// Resolve a courier's display name from the branch courier list (order.courier
// is an unpopulated id).
export const courierName = (order, couriers = []) => {
    if (!order?.courier) return null;
    const c = couriers.find((x) => x._id === order.courier);
    return c ? (c.fullName || c.phoneNumber) : null;
};
