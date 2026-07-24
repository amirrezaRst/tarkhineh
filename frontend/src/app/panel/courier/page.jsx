"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import MetricBar from "@/components/panel/MetricBar";
import { Skeleton } from "@/components/panel/Skeleton";
import DeliveryCard from "./DeliveryCard";
import CompleteDeliveryModal from "./CompleteDeliveryModal";
import { shortId, itemsSummary, relativeFa, mapUrl } from "./courierClientUtils";

const CourierDashboard = () => {
    const name = useUserStore((s) => s.user?.fullName);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const load = async (signal) => {
        try {
            const res = await api.get("/courier/dashboard", { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const c = new AbortController();
        load(c.signal);
        return () => c.abort();
    }, []);

    const onCompleted = () => load();
    const active = data?.activeDeliveries || [];
    const hero = active[0];
    const rest = active.slice(1);
    const offline = data?.courierStatus === "offline";
    const s = data?.stats || {};

    return (
        <div className="w-full max-w-[1080px]">
            <h1 className="text-2xl font-bold">سلام{name ? `، ${name}` : ""} 👋</h1>
            <p className="text-muted-fg text-super-sm mt-1.5 mb-5">وضعیت امروز شما و تحویل جاری</p>

            {offline && (
                <div className="flex items-center gap-2.5 bg-warning-subtle border border-warning/20 text-warning-fg rounded-2xl px-4 py-3 mb-4 text-super-sm font-semibold">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M12 3l9 16H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    شما آفلاین هستید و سفارش جدید دریافت نمی‌کنید. برای دریافت سفارش، از نوار بالا آنلاین شوید.
                </div>
            )}

            {loading ? (
                <Skeleton className="h-[92px] rounded-2xl mb-4" />
            ) : (
                <div className="mb-4">
                    <MetricBar items={[
                        { value: PersianNumber(s.deliveredToday ?? 0), label: "تحویل امروز" },
                        { value: PersianNumber(s.active ?? 0), label: "در حال تحویل" },
                        { value: s.avgMinutes != null ? `${PersianNumber(s.avgMinutes)}′` : "—", label: "میانگین زمان" },
                        { value: `${FormatPrice(s.feesToday ?? 0)}`, label: "هزینهٔ ارسال امروز (ت)" },
                    ]} />
                </div>
            )}

            {loading ? (
                <Skeleton className="h-56 rounded-[22px]" />
            ) : hero ? (
                <>
                    {/* active delivery hero */}
                    <div className="relative overflow-hidden rounded-[22px] p-6 text-white bg-gradient-to-tl from-feature-from via-feature-mid to-feature-to shadow-soft-lg">
                        <div className="absolute -top-14 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                        <div className="relative flex items-center justify-between gap-3 mb-4">
                            <span className="inline-flex items-center gap-2 text-super-xs font-extrabold bg-white/15 px-3 py-1.5 rounded-full">
                                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" /></span>
                                تحویل جاری
                            </span>
                            <span className="text-super-xs text-white/70">تخصیص {relativeFa(hero.assignedAt || hero.createdAt)}</span>
                        </div>
                        <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-5">
                            <div>
                                <div className="text-super-xs text-white/70 font-bold">سفارش #{shortId(hero._id)}</div>
                                <div className="text-xl font-extrabold mt-0.5">{hero.user?.fullName || hero.deliveryAddress?.recipientFullName || "مشتری"}<span className="text-super-sm font-medium text-white/70 mr-2 tabular-nums">{hero.user?.phoneNumber || hero.deliveryAddress?.recipientPhoneNumber}</span></div>
                                {hero.deliveryAddress?.addressLine && (
                                    <div className="flex items-start gap-2 mt-3.5 bg-white/10 rounded-xl px-3.5 py-3 text-super-sm leading-7">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-1"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" /></svg>
                                        {hero.deliveryAddress.addressLine}
                                    </div>
                                )}
                            </div>
                            <div className="md:border-r md:border-white/15 md:pr-5 flex flex-col">
                                <div className="text-super-sm text-white/85 leading-8 flex-1">{itemsSummary(hero.items)}</div>
                                <div className="text-super-xs text-white/70 mt-2">مبلغ قابل دریافت<div className="text-xl font-extrabold text-white tabular-nums">{FormatPrice(hero.finalPrice)} تومان</div></div>
                            </div>
                        </div>
                        <div className="relative flex gap-2.5 mt-5 flex-wrap">
                            <button onClick={() => setSelected(hero)} className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-white text-feature-from rounded-xl py-3 text-super-sm font-extrabold hover:bg-[hsl(var(--brand-50))] min-h-[48px]">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>تحویل دادم
                            </button>
                            {(hero.user?.phoneNumber || hero.deliveryAddress?.recipientPhoneNumber) && (
                                <a href={`tel:${hero.user?.phoneNumber || hero.deliveryAddress?.recipientPhoneNumber}`} className="inline-flex items-center justify-center gap-2 bg-white/15 text-white rounded-xl px-5 py-3 text-super-sm font-bold min-h-[48px]">تماس با مشتری</a>
                            )}
                            {hero.deliveryAddress?.addressLine && (
                                <a href={mapUrl(hero.deliveryAddress.addressLine)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white rounded-xl px-5 py-3 text-super-sm font-bold min-h-[48px]">مسیریابی</a>
                            )}
                        </div>
                    </div>

                    {rest.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-super-base font-extrabold mb-3">تحویل‌های بعدی در نوبت</h2>
                            <div className="flex flex-col gap-3">
                                {rest.map((o) => <DeliveryCard key={o._id} order={o} onComplete={setSelected} />)}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-surface rounded-[22px] border border-dashed border-border-strong p-12 text-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-[hsl(var(--brand-400))]"><path d="M3 13h11V6H3zM14 9h4l3 3v3h-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" /></svg>
                    <p className="text-super-base font-extrabold">در حال حاضر تحویلی ندارید</p>
                    <p className="text-super-sm text-muted-fg mt-1.5">{offline ? "برای دریافت سفارش، آنلاین شوید." : "به‌محض تخصیص سفارش توسط مدیر شعبه، اینجا نمایش داده می‌شود."}</p>
                </div>
            )}

            <CompleteDeliveryModal open={!!selected} onClose={() => setSelected(null)} order={selected} onCompleted={onCompleted} />
        </div>
    );
};

export default CourierDashboard;
