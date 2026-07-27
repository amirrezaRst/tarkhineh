"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import Modal from "@/components/panel/Modal";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import BarChart from "@/components/panel/charts/BarChart";
import OrderStatusBadge from "@/components/panel/OrderStatusBadge";
import { Skeleton } from "@/components/panel/Skeleton";
import { updateCourier, deleteCourier } from "@/services/BranchManagerService";
import CourierAvatar from "./CourierAvatar";
import { VEHICLE_LABEL, courierState, STATE_META } from "./courierUtils";

const weekdayShort = (iso) => new Date(iso).toLocaleDateString("fa-IR", { weekday: "short" });

const CourierDetailModal = ({ open, onClose, branch, courierId, capacity, onChanged }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/branch-manager/couriers/${branch}/${courierId}`);
            setData(res.data);
        } catch { toast.error("خطا در دریافت اطلاعات پیک."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!open || !courierId) return;
        setData(null);
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, courierId]);

    const courier = data?.courier;
    const state = courier ? courierState(courier) : "free";
    const meta = STATE_META[state];

    const toggleStatus = async () => {
        setBusy(true);
        await updateCourier(branch, courierId, { courierStatus: courier.courierStatus === "offline" ? "available" : "offline" }, () => { load(); onChanged?.(); });
        setBusy(false);
    };
    const remove = async () => {
        if (!confirm("آیا از حذف این پیک مطمئن هستید؟")) return;
        setBusy(true);
        await deleteCourier(branch, courierId, () => { onChanged?.(); onClose(); });
        setBusy(false);
    };

    const weekData = (data?.weeklyDeliveries || []).map((d) => ({ label: weekdayShort(d.date), value: d.count }));
    const weekTotal = weekData.reduce((s, d) => s + d.value, 0);

    return (
        <Modal open={open} onClose={onClose} size="lg">
            {loading || !courier ? (
                <div className="p-6 space-y-4"><Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" /></div>
            ) : (
                <>
                    {/* header */}
                    <div className="relative overflow-hidden rounded-t-2xl p-5 text-white bg-gradient-to-tl from-feature-from via-feature-mid to-feature-to flex items-center gap-4">
                        <div className="absolute -top-10 -left-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                        <div className="relative"><CourierAvatar courier={courier} size={72} radius={18} /></div>
                        <div className="relative min-w-0 flex-1">
                            <div className="text-lg font-extrabold truncate">{courier.fullName || "بدون نام"}</div>
                            <div className="text-super-xs text-white/75 mt-0.5">
                                {VEHICLE_LABEL[courier.vehicleType]}{courier.plateNumber ? ` · پلاک ${courier.plateNumber}` : ""}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-super-xs font-bold bg-white/15 rounded-full px-2.5 py-1">● {meta.label}</span>
                                <span className="text-super-xs font-bold bg-white/15 rounded-full px-2.5 py-1">ظرفیت {PersianNumber(courier.activeOrders)} از {PersianNumber(capacity)}</span>
                            </div>
                        </div>
                        <div className="relative flex gap-2">
                            <a href={`tel:${courier.phoneNumber}`} className="text-super-xs font-bold bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 transition-colors">تماس</a>
                            <a href={`sms:${courier.phoneNumber}`} className="text-super-xs font-bold bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 transition-colors">پیام</a>
                            <button onClick={onClose} aria-label="بستن" className="w-9 h-9 grid place-items-center rounded-lg bg-white/15 hover:bg-white/25">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-5">
                        {/* KPIs */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl p-3.5 bg-primary-subtle border border-primary/15"><div className="text-super-base font-extrabold tabular-nums">{courier.avgMinutes != null ? `${PersianNumber(courier.avgMinutes)} دقیقه` : "—"}</div><div className="text-super-xs text-muted-fg mt-0.5">میانگین زمان تحویل</div></div>
                            <div className="rounded-xl p-3.5 bg-surface-sunken"><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(courier.totalDeliveries ?? 0)}</div><div className="text-super-xs text-muted-fg mt-0.5">کل تحویل‌ها</div></div>
                            <div className="rounded-xl p-3.5 bg-surface-sunken"><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(courier.deliveredToday ?? 0)}</div><div className="text-super-xs text-muted-fg mt-0.5">تحویل امروز</div></div>
                        </div>

                        {/* weekly chart */}
                        <div className="flex items-end justify-between mt-5 mb-1">
                            <div className="text-super-sm font-extrabold">تحویل‌های این هفته</div>
                            <div className="text-super-xs text-muted-fg">مجموع: <b className="tabular-nums">{PersianNumber(weekTotal)}</b></div>
                        </div>
                        <BarChart data={weekData} height={90} formatValue={(v) => `${PersianNumber(v)} تحویل`} />

                        {/* current orders */}
                        <div className="text-super-sm font-extrabold mt-5 mb-2.5">سفارش‌های جاری این پیک</div>
                        {(data.currentOrders?.length ?? 0) === 0 ? (
                            <p className="text-super-xs text-muted-fg py-3">در حال حاضر سفارش فعالی ندارد.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {data.currentOrders.map((o) => (
                                    <div key={o._id} className="flex items-center gap-3 bg-surface-sunken rounded-xl px-3.5 py-2.5">
                                        <span className="font-extrabold text-primary-hover text-super-xs">#{PersianNumber(String(o._id).slice(-5))}</span>
                                        <span className="text-super-xs font-semibold truncate">{o.user?.fullName || o.user?.phoneNumber}</span>
                                        <span className="mr-auto text-super-xs font-bold tabular-nums">{FormatPrice(o.finalPrice)}</span>
                                        <OrderStatusBadge status={o.status} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* actions */}
                        <div className="flex gap-2.5 mt-5 pt-4 border-t border-border">
                            <button onClick={toggleStatus} disabled={busy} className="bg-surface-sunken text-foreground rounded-xl px-4 py-2.5 text-super-sm font-bold disabled:opacity-50">
                                {courier.courierStatus === "offline" ? "فعال‌سازی (آنلاین)" : "تغییر به آفلاین"}
                            </button>
                            <button onClick={remove} disabled={busy} className="bg-destructive-subtle text-destructive rounded-xl px-4 py-2.5 text-super-sm font-bold disabled:opacity-50 mr-auto">حذف پیک</button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CourierDetailModal;
