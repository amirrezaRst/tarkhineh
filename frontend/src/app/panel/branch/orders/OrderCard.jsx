"use client";

import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";
import OrderStatusBadge, { statusMeta } from "@/components/panel/OrderStatusBadge";
import { DeliveryIcon } from "@/assets/Icons";
import { faTime, relativeFa, itemsSummary, shortId, courierName, agingInfo } from "./orderUtils";
import useOrderActions from "./useOrderActions";
import CourierSelect from "./CourierSelect";

const AGE_CLS = { ok: "bg-surface-sunken text-muted-fg", warn: "bg-warning-subtle text-warning-fg", crit: "bg-destructive-subtle text-destructive" };
const AgeChip = ({ order }) => {
    if (order.status !== "pending" && order.status !== "preparing") return null;
    const { minutes, level } = agingInfo(order);
    return (
        <span className={`inline-flex items-center gap-1 text-super-xs font-extrabold px-2 py-0.5 rounded-full ${AGE_CLS[level]}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 21a9 9 0 1 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {PersianNumber(minutes)} دقیقه{level !== "ok" ? " معطل" : ""}
        </span>
    );
};

const DeliveryPill = ({ type }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-super-xs font-bold ${type === "courier" ? "bg-status-preparing-subtle text-status-preparing" : "bg-surface-sunken text-muted-fg border border-border"
        }`}>
        {type === "courier" && <DeliveryIcon className="w-3.5 h-3.5 fill-current" />}
        {type === "courier" ? "ارسال با پیک" : "تحویل حضوری"}
    </span>
);

const OrderCard = ({ order, couriers, capacity = 3, selected, onSelect, onChanged }) => {
    const { eta, setEta, courierId, setCourierId, busy, approve, assignAndSend, markDelivered, cancel } =
        useOrderActions(order, onChanged);

    const accent = statusMeta[order.status]?.dot || "bg-border";
    const stop = (e) => e.stopPropagation();

    return (
        <div
            onClick={onSelect}
            className={`relative overflow-hidden bg-surface rounded-2xl p-4 pr-5 cursor-pointer transition-all duration-200 ${selected
                ? "shadow-soft-lg ring-2 ring-primary"
                : "shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5"
                }`}
        >
            <span className={`absolute top-0 bottom-0 right-0 w-1.5 ${accent}`} />

            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-extrabold text-primary-hover text-super-sm">#{shortId(order._id)}</span>
                    <span className="text-super-xs text-subtle-fg truncate">{faTime(order.createdAt)} · {relativeFa(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <AgeChip order={order} />
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            <p className="font-bold text-super-sm">
                {order.user?.fullName || "مشتری"}
                <span className="text-subtle-fg font-medium text-super-xs mr-1.5">· {order.user?.phoneNumber}</span>
            </p>
            <p className="text-super-xs text-muted-fg mt-1 line-clamp-1">{itemsSummary(order.items)}</p>

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-border flex-wrap">
                <div className="flex items-center gap-2.5">
                    <DeliveryPill type={order.deliveryType} />
                    <span className="font-extrabold text-super-sm tabular-nums">{FormatPrice(order.finalPrice)} تومان</span>
                </div>

                {/* Inline quick actions per status */}
                <div className="flex items-center gap-2" onClick={stop}>
                    {order.status === "pending" && (
                        <>
                            <span className="inline-flex items-center gap-1.5 text-super-xs text-muted-fg">
                                <input
                                    type="number" min="5" value={eta}
                                    onChange={(e) => setEta(e.target.value)}
                                    className="w-14 border border-border rounded-lg px-2 py-1.5 text-super-sm text-center tabular-nums bg-surface"
                                    aria-label="زمان تقریبی آماده‌سازی (دقیقه)"
                                />
                                دقیقه
                            </span>
                            <button onClick={approve} disabled={busy}
                                className="bg-primary text-primary-fg rounded-lg px-3.5 py-2 text-super-xs font-bold hover:bg-primary-hover disabled:opacity-50">
                                تایید سفارش
                            </button>
                            <button onClick={cancel} disabled={busy}
                                className="bg-destructive-subtle text-destructive rounded-lg px-3 py-2 text-super-xs font-bold disabled:opacity-50">
                                لغو
                            </button>
                        </>
                    )}

                    {order.status === "preparing" && order.deliveryType === "courier" && (
                        <>
                            <CourierSelect couriers={couriers} capacity={capacity} value={courierId} onChange={setCourierId} />
                            <button onClick={assignAndSend} disabled={busy || !courierId}
                                className="bg-primary text-primary-fg rounded-lg px-3.5 py-2 text-super-xs font-bold hover:bg-primary-hover disabled:opacity-50">
                                ارسال
                            </button>
                        </>
                    )}

                    {order.status === "preparing" && order.deliveryType === "person" && (
                        <button onClick={markDelivered} disabled={busy}
                            className="bg-primary text-primary-fg rounded-lg px-3.5 py-2 text-super-xs font-bold hover:bg-primary-hover disabled:opacity-50">
                            تحویل داده شد
                        </button>
                    )}

                    {order.status === "on_the_way" && (
                        <>
                            <span className="text-super-xs text-subtle-fg">
                                {courierName(order, couriers) ? `پیک: ${courierName(order, couriers)}` : "در حال تحویل"}
                            </span>
                            <button onClick={markDelivered} disabled={busy}
                                className="bg-primary text-primary-fg rounded-lg px-3.5 py-2 text-super-xs font-bold hover:bg-primary-hover disabled:opacity-50">
                                تحویل داده شد
                            </button>
                        </>
                    )}

                    {order.status === "delivered" && (
                        <span className="text-super-xs text-subtle-fg">تحویل شده {order.deliveredAt ? `در ${faTime(order.deliveredAt)}` : ""}</span>
                    )}
                    {order.status === "cancelled" && (
                        <span className="text-super-xs text-destructive">لغو شده</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
