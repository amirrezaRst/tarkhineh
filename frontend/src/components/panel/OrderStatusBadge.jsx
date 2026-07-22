const statusConfig = {
    pending: { label: "در انتظار تایید", bg: "bg-status-pending-subtle", text: "text-status-pending" },
    preparing: { label: "در حال آماده‌سازی", bg: "bg-status-preparing-subtle", text: "text-status-preparing" },
    on_the_way: { label: "ارسال شده", bg: "bg-status-on-the-way-subtle", text: "text-status-on-the-way" },
    delivered: { label: "تحویل شده", bg: "bg-status-delivered-subtle", text: "text-status-delivered" },
    cancelled: { label: "لغو شده", bg: "bg-status-cancelled-subtle", text: "text-status-cancelled" },
};

const OrderStatusBadge = ({ status }) => {
    const config = statusConfig[status];
    if (!config) return null;

    return (
        <span className={`inline-block rounded-md py-1.5 px-3 text-sm font-medium whitespace-nowrap ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
