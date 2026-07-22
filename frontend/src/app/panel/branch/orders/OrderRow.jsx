"use client";

import { useState } from "react";
import FormatPrice from "@/utils/FormatPrice";
import { deliveryTypeDic } from "@/constant/branchDictionary";
import OrderStatusBadge from "@/components/panel/OrderStatusBadge";
import { approveOrder, assignCourier, updateOrderStatus } from "@/services/BranchManagerService";

const OrderRow = ({ order, couriers, onChanged }) => {
    const [eta, setEta] = useState(30);
    const [courierId, setCourierId] = useState("");
    const [busy, setBusy] = useState(false);

    const withBusy = async (action) => {
        setBusy(true);
        await action();
        setBusy(false);
    };

    const handleApprove = () => withBusy(async () => {
        await approveOrder(order._id, Number(eta), () => { });
        await updateOrderStatus(order._id, "preparing", onChanged);
    });

    const handleAssignAndSend = () => withBusy(async () => {
        if (!courierId) return;
        await assignCourier(order._id, courierId, () => { });
        await updateOrderStatus(order._id, "on_the_way", onChanged);
    });

    const handleMarkDelivered = () => withBusy(() => updateOrderStatus(order._id, "delivered", onChanged));
    const handleCancel = () => withBusy(() => updateOrderStatus(order._id, "cancelled", onChanged));

    return (
        <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-foreground font-medium">{order.user?.fullName || order.user?.phoneNumber}</p>
                    <p className="text-muted-fg text-super-xs mt-1">
                        {order.items.map((item) => `${item.menuItem?.name} × ${item.quantity}`).join("، ")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-surface-sunken text-foreground rounded-md py-1.5 px-3 text-super-sm">
                        {deliveryTypeDic[order.deliveryType]}
                    </span>
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="text-foreground font-semibold">{FormatPrice(order.finalPrice)} تومان</span>

                {order.status === "pending" && (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="5"
                            value={eta}
                            onChange={(e) => setEta(e.target.value)}
                            className="w-20 border border-border rounded-md px-2 py-1.5 text-super-sm text-center"
                            aria-label="زمان تقریبی آماده‌سازی (دقیقه)"
                        />
                        <span className="text-muted-fg text-super-xs">دقیقه</span>
                        <button
                            onClick={handleApprove}
                            disabled={busy}
                            className="bg-primary text-primary-fg rounded-md px-4 py-1.5 text-super-sm font-medium disabled:opacity-50"
                        >
                            تایید سفارش
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={busy}
                            className="bg-destructive-subtle text-destructive rounded-md px-4 py-1.5 text-super-sm font-medium disabled:opacity-50"
                        >
                            لغو
                        </button>
                    </div>
                )}

                {order.status === "preparing" && order.deliveryType === "courier" && (
                    <div className="flex items-center gap-2">
                        <select
                            value={courierId}
                            onChange={(e) => setCourierId(e.target.value)}
                            className="border border-border rounded-md px-2 py-1.5 text-super-sm"
                        >
                            <option value="">انتخاب پیک</option>
                            {couriers.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.fullName || c.phoneNumber} ({c.activeOrders} سفارش فعال)
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssignAndSend}
                            disabled={busy || !courierId}
                            className="bg-primary text-primary-fg rounded-md px-4 py-1.5 text-super-sm font-medium disabled:opacity-50"
                        >
                            ارسال با پیک
                        </button>
                    </div>
                )}

                {order.status === "preparing" && order.deliveryType === "person" && (
                    <button
                        onClick={handleMarkDelivered}
                        disabled={busy}
                        className="bg-primary text-primary-fg rounded-md px-4 py-1.5 text-super-sm font-medium disabled:opacity-50"
                    >
                        تحویل داده شد
                    </button>
                )}

                {order.status === "on_the_way" && (
                    <button
                        onClick={handleMarkDelivered}
                        disabled={busy}
                        className="bg-primary text-primary-fg rounded-md px-4 py-1.5 text-super-sm font-medium disabled:opacity-50"
                    >
                        تحویل داده شد
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderRow;
