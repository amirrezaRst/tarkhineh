"use client";

import { useState } from "react";
import Modal from "@/components/panel/Modal";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { StatusPill, PAYMENT_LABEL, DELIVERY_LABEL } from "../adminUtils";
import { cancelOrder } from "@/services/AdminService";

const faDateTime = (d) => (d ? new Date(d).toLocaleString("fa-IR", { dateStyle: "medium", timeStyle: "short" }) : "—");
const Row = ({ k, v }) => <div className="flex justify-between gap-3 py-2 border-b border-border last:border-0 text-super-sm"><span className="text-muted-fg">{k}</span><span className="font-bold text-left">{v}</span></div>;

const OrderDetailModal = ({ open, onClose, order, onChanged }) => {
    const [busy, setBusy] = useState(false);
    if (!order) return null;
    const canCancel = order.status !== "delivered" && order.status !== "cancelled";

    const doCancel = async () => {
        if (!confirm("این سفارش لغو شود؟")) return;
        setBusy(true);
        await cancelOrder(order._id, () => { onChanged?.(); onClose(); });
        setBusy(false);
    };

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-lg font-extrabold">سفارش #{PersianNumber(String(order._id).slice(-5))}</h2>
                        <p className="text-super-xs text-muted-fg mt-1">{faDateTime(order.createdAt)}</p>
                    </div>
                    <StatusPill status={order.status} />
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6">
                    <div>
                        <Row k="مشتری" v={order.user?.fullName || "—"} />
                        <Row k="تلفن" v={<span className="tabular-nums">{order.user?.phoneNumber || order.deliveryAddress?.recipientPhoneNumber || "—"}</span>} />
                        <Row k="شعبه" v={order.branch?.name || "—"} />
                        <Row k="نوع تحویل" v={DELIVERY_LABEL[order.deliveryType] || "—"} />
                        <Row k="پیک" v={order.courier?.fullName || "—"} />
                    </div>
                    <div>
                        <Row k="پرداخت" v={PAYMENT_LABEL[order.paymentStatus] || "—"} />
                        <Row k="روش" v={order.paymentMethod === "cash" ? "نقدی" : "آنلاین"} />
                        <Row k="هزینهٔ ارسال" v={`${FormatPrice(order.deliveryFee || 0)} ت`} />
                        <Row k="بازپرداخت" v={order.refundStatus && order.refundStatus !== "none" ? (order.refundStatus === "requested" ? "درخواست‌شده" : "انجام‌شده") : "—"} />
                        <Row k="زمان تحویل" v={faDateTime(order.deliveredAt)} />
                    </div>
                </div>

                {order.deliveryAddress?.addressLine && (
                    <div className="mt-3 bg-surface-sunken rounded-xl px-3.5 py-3 text-super-sm leading-7">
                        <span className="text-muted-fg text-super-xs">آدرس: </span>{order.deliveryAddress.addressLine}
                    </div>
                )}

                <h3 className="text-super-sm font-extrabold mt-5 mb-2">اقلام</h3>
                <div className="bg-surface-sunken rounded-xl divide-y divide-border">
                    {(order.items || []).map((it, i) => (
                        <div key={i} className="flex justify-between items-center px-3.5 py-2.5 text-super-sm">
                            <span>{it.menuItem?.name || "آیتم حذف‌شده"} <span className="text-muted-fg text-super-xs">× {PersianNumber(it.quantity)}</span></span>
                            <span className="tabular-nums font-bold">{FormatPrice(it.price)} ت</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-super-sm text-muted-fg">مبلغ کل</span>
                    <span className="text-xl font-extrabold tabular-nums">{FormatPrice(order.finalPrice)} تومان</span>
                </div>

                <div className="flex gap-3 mt-5">
                    {canCancel && (
                        <button onClick={doCancel} disabled={busy} className="flex-1 bg-destructive-subtle text-destructive rounded-xl py-3 text-super-sm font-bold hover:bg-destructive hover:text-white transition-colors disabled:opacity-50">
                            {busy ? "در حال لغو…" : "لغو سفارش" + (order.paymentStatus === "paid" ? " و بازپرداخت" : "")}
                        </button>
                    )}
                    <button onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">بستن</button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailModal;
