"use client";

import FormatPrice from "@/utils/FormatPrice";
import { shortId, itemsSummary, relativeFa, mapUrl } from "./courierClientUtils";

const PinIcon = (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" /></svg>;
const PhoneIcon = (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;

// One assigned (en-route) delivery. `onComplete` opens the code modal.
const DeliveryCard = ({ order, onComplete }) => {
    const addr = order.deliveryAddress?.addressLine || "";
    const phone = order.user?.phoneNumber || order.deliveryAddress?.recipientPhoneNumber;

    return (
        <div className="relative overflow-hidden bg-surface rounded-2xl shadow-soft p-4 pr-5">
            <span className="absolute top-3.5 bottom-3.5 right-0 w-1 rounded-full bg-status-on-the-way" />

            <div className="flex items-center justify-between gap-3">
                <span className="font-extrabold text-primary-hover text-super-sm">#{shortId(order._id)}</span>
                <span className="text-super-xs text-subtle-fg">{relativeFa(order.assignedAt || order.createdAt)} تخصیص</span>
            </div>

            <p className="font-bold text-super-sm mt-1.5">
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
                <span className="font-extrabold text-super-sm tabular-nums">{FormatPrice(order.finalPrice)} تومان</span>
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
                    <button onClick={() => onComplete(order)}
                        className="bg-primary text-primary-fg rounded-xl px-4 py-2 text-super-xs font-bold hover:bg-primary-hover min-h-[40px]">
                        تحویل دادم
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryCard;
