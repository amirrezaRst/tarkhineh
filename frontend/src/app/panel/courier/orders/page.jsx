"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton, SkeletonOrderRow } from "@/components/Skeleton";
import DeliveryCard from "../DeliveryCard";
import CompleteDeliveryModal from "../CompleteDeliveryModal";
import { LedgerCard, AvailabilityControl } from "../courierWidgets";
import { markPickedUp } from "@/services/CourierService";

const POLL_MS = 25000;

const CourierDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const abortRef = useRef(null);

    const load = useCallback(async ({ silent } = {}) => {
        abortRef.current?.abort();
        const c = new AbortController();
        abortRef.current = c;
        if (!silent) setLoading(true);
        try {
            const res = await api.get("/courier/deliveries", { signal: c.signal });
            setDeliveries(res.data.deliveries);
        } catch (err) { if (err.name !== "AbortError" && !silent) toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { if (!silent) setLoading(false); }
    }, []);

    useEffect(() => {
        load();
        const id = setInterval(() => load({ silent: true }), POLL_MS);
        return () => { clearInterval(id); abortRef.current?.abort(); };
    }, [load]);

    const onPickup = async (order) => { await markPickedUp(order._id, () => load({ silent: true })); };

    const awaiting = deliveries.filter((o) => o.status === "preparing").length;
    const enRoute = deliveries.filter((o) => o.status === "on_the_way").length;

    return (
        <div className="w-full">
            <PanelPageHeader title="تحویل‌های فعال" subtitle="سفارش‌هایی که به شما تخصیص داده شده و باید تحویل دهید" />

            <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
                <div className="min-w-0">
                    {loading ? (
                        <div className="flex flex-col gap-3"><SkeletonOrderRow /><SkeletonOrderRow /></div>
                    ) : deliveries.length === 0 ? (
                        <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">
                            در حال حاضر تحویل فعالی ندارید.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {deliveries.map((o) => <DeliveryCard key={o._id} order={o} onPickup={onPickup} onComplete={setSelected} />)}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    {loading ? (
                        <><Skeleton className="h-36 rounded-2xl" /><Skeleton className="h-32 rounded-2xl" /></>
                    ) : (
                        <>
                            <LedgerCard title="خلاصهٔ تحویل‌ها" rows={[
                                { k: "در انتظار تحویل از شعبه", v: PersianNumber(awaiting) },
                                { k: "در مسیر", v: PersianNumber(enRoute) },
                                { k: "مجموع فعال", v: PersianNumber(deliveries.length) },
                            ]} />
                            <AvailabilityControl onChange={() => load({ silent: true })} />
                            <div className="bg-[hsl(var(--brand-50))] border border-[hsl(var(--brand-200))] rounded-2xl px-4 py-3.5 text-super-xs text-[hsl(var(--brand-700))] leading-7">
                                🛍 سفارش‌هایی که هنوز در شعبه آماده می‌شوند با برچسب آبی و دکمهٔ «تحویل گرفتم» مشخص‌اند؛ پس از تحویل‌گرفتن، وارد مرحلهٔ «در مسیر» می‌شوند.
                            </div>
                        </>
                    )}
                </div>
            </div>

            <CompleteDeliveryModal open={!!selected} onClose={() => setSelected(null)} order={selected} onCompleted={() => load({ silent: true })} />
        </div>
    );
};

export default CourierDeliveries;
