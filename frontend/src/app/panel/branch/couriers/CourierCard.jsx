"use client";

import PersianNumber from "@/utils/ConvertToPersianNumber";
import CourierAvatar from "./CourierAvatar";
import { VEHICLE_LABEL, courierState, STATE_META } from "./courierUtils";

const VehicleIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}><circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M9 17h6l2-6h3M9 17l-2-7H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const CourierCard = ({ courier, capacity, onOpen }) => {
    const state = courierState(courier);
    const meta = STATE_META[state];
    const active = courier.activeOrders || 0;
    const full = active >= capacity;
    const segs = Array.from({ length: capacity }, (_, i) => i < active);

    return (
        <div onClick={onOpen} className={`bg-surface rounded-2xl shadow-soft p-4 transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer ${state === "off" ? "opacity-75" : ""}`}>
            <div className="flex items-center gap-3">
                <CourierAvatar courier={courier} />
                <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-super-sm truncate">{courier.fullName || "بدون نام"}</p>
                    <p className="text-super-xs text-muted-fg flex items-center gap-1.5 mt-0.5">
                        <VehicleIcon className="w-3.5 h-3.5" />
                        {VEHICLE_LABEL[courier.vehicleType] || "موتورسیکلت"}
                        {courier.plateNumber && <span className="font-bold text-foreground bg-surface-sunken border border-border rounded px-1 tabular-nums">{courier.plateNumber}</span>}
                    </p>
                </div>
                <div className={`text-left ${meta.text}`}>
                    <div className="text-super-xs font-extrabold">{meta.label}</div>
                    <div className="text-[10.5px] text-subtle-fg font-semibold">{meta.sub}</div>
                </div>
            </div>

            {state === "busy" && (
                <div className="flex items-center gap-2 text-super-xs font-bold text-status-preparing bg-status-preparing-subtle rounded-xl px-3 py-2 mt-3">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-preparing opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-preparing" />
                    </span>
                    {PersianNumber(active)} سفارش در حال تحویل
                </div>
            )}

            <div className="mt-3">
                <div className="flex items-center justify-between text-super-xs mb-1.5">
                    <b className="font-extrabold">بار کاری</b>
                    <span className="text-muted-fg tabular-nums">{state === "off" ? "خارج از دسترس" : `${PersianNumber(active)} از ${PersianNumber(capacity)} سفارش`}</span>
                </div>
                <div className="flex gap-[3px] h-2">
                    {segs.map((on, i) => (
                        <span key={i} className={`flex-1 rounded-full ${on ? (full ? "bg-warning" : "bg-primary") : "bg-surface-sunken"}`} />
                    ))}
                </div>
                {full && state !== "off" && (
                    <div className="flex items-center gap-1.5 text-super-xs text-warning font-bold mt-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        ظرفیت تکمیل — سفارش جدید اختصاص نده
                    </div>
                )}
            </div>

            <div className="flex gap-2.5 mt-3">
                <Stat v={PersianNumber(courier.deliveredToday ?? 0)} l="تحویل امروز" />
                <Stat v={courier.avgMinutes != null ? `${PersianNumber(courier.avgMinutes)}′` : "—"} l="میانگین زمان" />
                <Stat v={PersianNumber(courier.totalDeliveries ?? 0)} l="کل تحویل" />
            </div>

            <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                <a href={`tel:${courier.phoneNumber}`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-super-xs font-bold py-2.5 rounded-xl bg-primary-subtle text-primary hover:bg-primary/15 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>تماس
                </a>
                <a href={`sms:${courier.phoneNumber}`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-super-xs font-bold py-2.5 rounded-xl border border-border text-muted-fg hover:text-foreground hover:border-border-strong transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>پیام
                </a>
                <button onClick={onOpen} className="flex-1 text-super-xs font-bold py-2.5 rounded-xl border border-border text-muted-fg hover:text-foreground hover:border-border-strong transition-colors">جزئیات</button>
            </div>
        </div>
    );
};

const Stat = ({ v, l }) => (
    <div className="flex-1 bg-surface-sunken rounded-xl p-2.5 text-center">
        <div className="text-super-base font-extrabold tabular-nums">{v}</div>
        <div className="text-[10.5px] text-muted-fg mt-0.5">{l}</div>
    </div>
);

export default CourierCard;
