"use client";

import { useState } from "react";
import FormatPrice from "@/utils/FormatPrice";
import { shortId, itemsSummary, relativeFa, mapUrl } from "./courierClientUtils";

const PinIcon = (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" /></svg>;
const PhoneIcon = (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
const BagIcon = (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 7h12l-1 13H7L6 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" /></svg>;
const CheckIcon = (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const STAGE = {
    preparing: { label: "در انتظار تحویل از شعبه", accent: "bg-status-preparing", pill: "bg-status-preparing-subtle text-status-preparing" },
    on_the_way: { label: "در مسیر", accent: "bg-status-on-the-way", pill: "bg-status-on-the-way-subtle text-status-on-the-way" },
};

// One assigned delivery. When the order is still being prepared, the courier picks
// it up (preparing -> on_the_way) via `onPickup`; once en route, `onComplete` opens
// the customer-code modal. pickupCode is never present on the order client-side.
const DeliveryCard = ({ order, onPickup, onComplete }) => {
    const [picking, setPicking] = useState(false);
    const stage = STAGE[order.status] || STAGE.on_the_way;
    const isPrep = order.status === "preparing";
    const addr = order.deliveryAddress?.addressLine || "";
    const phone = order.user?.phoneNumber || order.deliveryAddress?.recipientPhoneNumber;

    const pickup = async () => {
        if (picking) return;
        setPicking(true);
        await onPickup?.(order);
        setPicking(false);
    };

    return (
        <div className="relative overflow-hidden bg-surface rounded-2xl shadow-soft p-4 pr-5">
            <span className={`absolute top-3.5 bottom-3.5 right-0 w-1 rounded-full ${stage.accent}`} />

            <div className="flex items-center justify-between gap-3">
                <span className="font-extrabold text-primary-hover text-super-sm">#{shortId(order._id)}</span>
                <span className={`text-super-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${stage.pill}`}>{stage.label}</span>
            </div>

            <p className="font-bold text-super-sm mt-2">
                {order.user?.fullName || order.deliveryAddress?.recipientFullName || "مشتری"}
                {phone && <span className="text-subtle-fg font-medium text-super-xs mr-1.5">· {phone}</span>}
            </p>

            {addr && (
                <p className="flex items-start gap-1.5 text-super-xs text-muted-fg mt-2 leading-6">
                    <PinIcon className="w-3.5 h-3.5 mt-1 shrink-0" />
                    <span>{addr}</span>
                </p>
            )}

            <p className="text-super-xs text-subtle-fg mt-2 line-clamp-1">{itemsSummary(order.items)}</p>

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-border flex-wrap">
                <div className="flex flex-col">
                    <span className="font-extrabold text-super-sm tabular-nums">{FormatPrice(order.finalPrice)} تومان</span>
                    <span className="text-super-xs text-subtle-fg">{relativeFa(order.assignedAt || order.createdAt)} تخصیص</span>
                </div>
                <div className="flex items-center gap-2">
                    {addr && (
                        <a href={mapUrl(addr)} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-super-xs font-bold px-3 py-2 rounded-xl bg-status-on-the-way-subtle text-status-on-the-way min-h-[40px]">
                            <PinIcon className="w-3.5 h-3.5" /> مسیریابی
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`} aria-label="تماس با مشتری"
                            className="inline-flex items-center gap-1.5 text-super-xs font-bold px-3 py-2 rounded-xl border border-border text-muted-fg hover:text-foreground hover:border-border-strong min-h-[40px]">
                            <PhoneIcon className="w-3.5 h-3.5" /> تماس
                        </a>
                    )}
                    {isPrep ? (
                        <button onClick={pickup} disabled={picking}
                            className="inline-flex items-center gap-1.5 bg-status-preparing text-white rounded-xl px-4 py-2 text-super-xs font-bold hover:brightness-95 disabled:opacity-60 min-h-[40px]">
                            <BagIcon className="w-3.5 h-3.5" /> {picking ? "..." : "تحویل گرفتم"}
                        </button>
                    ) : (
                        <button onClick={() => onComplete?.(order)}
                            className="inline-flex items-center gap-1.5 bg-primary text-primary-fg rounded-xl px-4 py-2 text-super-xs font-bold hover:bg-primary-hover min-h-[40px]">
                            <CheckIcon className="w-3.5 h-3.5" /> تحویل دادم
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryCard;
