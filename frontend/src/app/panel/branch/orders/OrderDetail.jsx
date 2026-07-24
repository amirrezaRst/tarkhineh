"use client";

import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { faTime, shortId, courierName } from "./orderUtils";
import useOrderActions from "./useOrderActions";
import CourierSelect from "./CourierSelect";

const STATUS_RANK = { pending: 0, preparing: 1, on_the_way: 2, delivered: 3 };

// Build the 5-step order timeline from the order's timestamps + current status.
// Each step is done / current / todo based on how far the status has progressed.
const buildSteps = (order) => {
    const courier = order.deliveryType === "courier";
    const defs = [
        { title: "ثبت سفارش", time: order.createdAt, milestone: -1 },
        { title: "تایید شد", time: order.approvedAt, milestone: 0 },
        { title: "در حال آماده‌سازی", time: order.approvedAt, milestone: 1 },
        { title: courier ? "ارسال با پیک" : "آماده تحویل", time: order.assignedAt, milestone: 2 },
        { title: courier ? "تحویل به مشتری" : "تحویل حضوری", time: order.deliveredAt, milestone: 3 },
    ];
    const r = STATUS_RANK[order.status] ?? 0;
    const delivered = order.status === "delivered";
    return defs.map((s) => ({
        ...s,
        state: delivered || r > s.milestone ? "done" : r === s.milestone ? "current" : "todo",
    }));
};

const Dot = ({ state }) => (
    <span className={`relative z-10 mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 ${state === "done" ? "bg-primary border-primary"
        : state === "current" ? "bg-surface border-primary ring-4 ring-primary-subtle"
            : "bg-surface border-border-strong"
        }`} />
);

const OrderDetail = ({ order, couriers, capacity = 3, onChanged }) => {
    const { courierId, setCourierId, busy, assignAndSend, approve, eta, setEta, markDelivered, cancel } =
        useOrderActions(order, onChanged);

    const cancelled = order.status === "cancelled";
    const steps = buildSteps(order);
    const addr = order.deliveryAddress?.addressLine;

    return (
        <div className="bg-surface rounded-2xl shadow-soft overflow-hidden">
            {/* Header */}
            <div className="relative overflow-hidden p-5 text-white bg-gradient-to-tl from-feature-from via-feature-mid to-feature-to">
                <div className="absolute -top-12 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative flex items-center justify-between gap-3">
                    <div>
                        <div className="text-xl font-extrabold">#{shortId(order._id)}</div>
                        <div className="text-white/70 text-super-xs mt-1">امروز · {faTime(order.createdAt)}</div>
                    </div>
                    <span className="bg-white/15 text-white text-super-xs font-bold px-3 py-1.5 rounded-full">
                        {statusLabel(order.status)}
                    </span>
                </div>
            </div>

            <div className="p-5">
                {/* Timeline */}
                <SectionTitle>روند سفارش</SectionTitle>
                {cancelled ? (
                    <div className="flex items-start gap-3 mb-5">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-destructive shrink-0" />
                        <div>
                            <div className="text-super-sm font-bold text-destructive">سفارش لغو شد</div>
                            <div className="text-super-xs text-subtle-fg">این سفارش دیگر در جریان نیست.</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col mb-5">
                        {steps.map((s, i) => (
                            <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                                {i < steps.length - 1 && (
                                    <span className={`absolute right-[7px] top-4 w-0.5 h-[calc(100%-8px)] ${s.state === "done" ? "bg-primary" : "bg-border"}`} />
                                )}
                                <Dot state={s.state} />
                                <div className="min-w-0">
                                    <div className={`text-super-sm font-bold ${s.state === "todo" ? "text-subtle-fg" : "text-foreground"}`}>{s.title}</div>
                                    {s.time && s.state !== "todo" && (
                                        <div className="text-super-xs text-subtle-fg">
                                            {faTime(s.time)}
                                            {i === 1 && order.estimatedDeliveryTime ? " · زمان آماده‌سازی تعیین شد" : ""}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Divider />

                {/* Customer */}
                <SectionTitle>اطلاعات مشتری</SectionTitle>
                <InfoRow k="نام" v={order.user?.fullName || order.deliveryAddress?.recipientFullName || "—"} />
                <InfoRow k="تلفن" v={order.user?.phoneNumber || order.deliveryAddress?.recipientPhoneNumber || "—"} tnum />
                <InfoRow k="نوع تحویل" v={order.deliveryType === "courier" ? "ارسال با پیک" : "تحویل حضوری"} />
                {addr && <InfoRow k="آدرس" v={addr} />}
                {courierName(order, couriers) && <InfoRow k="پیک" v={courierName(order, couriers)} />}

                <Divider />

                {/* Items */}
                <SectionTitle>اقلام سفارش</SectionTitle>
                <div className="flex flex-col mb-1">
                    {order.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5 text-super-sm">
                            <span className="w-[26px] h-[26px] min-w-[26px] rounded-lg bg-primary-subtle text-primary grid place-items-center text-super-xs font-extrabold tabular-nums">
                                {PersianNumber(it.quantity)}
                            </span>
                            <span className="font-semibold truncate">{it.menuItem?.name || "—"}</span>
                            <span className="mr-auto font-bold text-muted-fg tabular-nums">{FormatPrice(it.price * it.quantity)}</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="bg-surface-sunken rounded-xl p-4 mt-3">
                    <TotRow k="جمع اقلام" v={`${FormatPrice(order.totalPrice)}`} />
                    {order.discount > 0 && <TotRow k="تخفیف" v={`−${FormatPrice(order.discount)}`} discount />}
                    {order.deliveryFee > 0 && <TotRow k="هزینه ارسال" v={`${FormatPrice(order.deliveryFee)}`} />}
                    <div className="flex justify-between items-center border-t border-dashed border-border-strong mt-2 pt-2.5">
                        <span className="font-extrabold">مبلغ نهایی</span>
                        <span className="font-extrabold tabular-nums">{FormatPrice(order.finalPrice)} تومان</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 mt-4">
                    {order.status === "pending" && (
                        <>
                            <div className="flex items-center gap-2">
                                <input type="number" min="5" value={eta} onChange={(e) => setEta(e.target.value)}
                                    className="w-20 border border-border rounded-lg px-2 py-2.5 text-super-sm text-center tabular-nums bg-surface"
                                    aria-label="زمان تقریبی آماده‌سازی (دقیقه)" />
                                <span className="text-super-xs text-muted-fg">دقیقه زمان آماده‌سازی</span>
                            </div>
                            <div className="flex gap-2.5">
                                <button onClick={approve} disabled={busy} className="flex-[2] bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">تایید و شروع آماده‌سازی</button>
                                <button onClick={cancel} disabled={busy} className="flex-1 bg-destructive-subtle text-destructive rounded-xl py-3 text-super-sm font-bold disabled:opacity-50">لغو سفارش</button>
                            </div>
                        </>
                    )}

                    {order.status === "preparing" && order.deliveryType === "courier" && (
                        <>
                            <CourierSelect couriers={couriers} capacity={capacity} value={courierId} onChange={setCourierId} full />
                            <button onClick={assignAndSend} disabled={busy || !courierId} className="w-full bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">ارسال با پیک</button>
                        </>
                    )}

                    {order.status === "preparing" && order.deliveryType === "person" && (
                        <button onClick={markDelivered} disabled={busy} className="w-full bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">تحویل حضوری انجام شد</button>
                    )}

                    {order.status === "on_the_way" && order.deliveryType === "courier" && (
                        <div className="rounded-xl bg-status-on-the-way-subtle text-status-on-the-way text-super-xs font-semibold leading-6 px-4 py-3 text-center">
                            در حال تحویل توسط پیک. با ثبت «کد تحویل» توسط پیک، وضعیت به‌طور خودکار «تحویل شده» می‌شود.
                        </div>
                    )}
                    {order.status === "on_the_way" && order.deliveryType === "person" && (
                        <button onClick={markDelivered} disabled={busy} className="w-full bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">تحویل حضوری انجام شد</button>
                    )}

                    {(order.status === "delivered" || order.status === "cancelled") && (
                        <div className={`text-center rounded-xl py-3 text-super-sm font-bold ${order.status === "delivered" ? "bg-status-delivered-subtle text-status-delivered" : "bg-status-cancelled-subtle text-status-cancelled"}`}>
                            {order.status === "delivered" ? `تحویل شده${order.deliveredAt ? ` · ${faTime(order.deliveredAt)}` : ""}` : "این سفارش لغو شده است"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const statusLabel = (s) => ({ pending: "در انتظار تایید", preparing: "در حال آماده‌سازی", on_the_way: "ارسال شده", delivered: "تحویل شده", cancelled: "لغو شده" }[s] || s);
const SectionTitle = ({ children }) => <div className="text-super-xs font-bold text-subtle-fg mb-3">{children}</div>;
const Divider = () => <div className="h-px bg-border my-4" />;
const InfoRow = ({ k, v, tnum }) => (
    <div className="flex justify-between gap-3 text-super-sm py-1">
        <span className="text-muted-fg shrink-0">{k}</span>
        <span className={`font-semibold text-left ${tnum ? "tabular-nums" : ""}`}>{v}</span>
    </div>
);
const TotRow = ({ k, v, discount }) => (
    <div className="flex justify-between text-super-sm py-0.5 text-muted-fg">
        <span>{k}</span>
        <span className={`tabular-nums ${discount ? "text-destructive" : ""}`}>{v}</span>
    </div>
);

export default OrderDetail;
