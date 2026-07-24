// Canonical order-status pill + colour source, shared by every panel page so a
// given status always reads the same. Uses the status-* domain tokens.
// `dotOnly` renders just the coloured dot (for tight rows / timelines).

export const statusMeta = {
    pending: { label: "در انتظار تایید", bg: "bg-status-pending-subtle", text: "text-status-pending", dot: "bg-status-pending", border: "border-status-pending" },
    preparing: { label: "در حال آماده‌سازی", bg: "bg-status-preparing-subtle", text: "text-status-preparing", dot: "bg-status-preparing", border: "border-status-preparing" },
    on_the_way: { label: "ارسال شده", bg: "bg-status-on-the-way-subtle", text: "text-status-on-the-way", dot: "bg-status-on-the-way", border: "border-status-on-the-way" },
    delivered: { label: "تحویل شده", bg: "bg-status-delivered-subtle", text: "text-status-delivered", dot: "bg-status-delivered", border: "border-status-delivered" },
    cancelled: { label: "لغو شده", bg: "bg-status-cancelled-subtle", text: "text-status-cancelled", dot: "bg-status-cancelled", border: "border-status-cancelled" },
};

const OrderStatusBadge = ({ status }) => {
    const meta = statusMeta[status];
    if (!meta) return null;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 text-super-xs font-medium whitespace-nowrap ${meta.bg} ${meta.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
        </span>
    );
};

export default OrderStatusBadge;
