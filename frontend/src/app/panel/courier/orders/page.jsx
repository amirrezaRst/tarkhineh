"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { SkeletonOrderRow } from "@/components/panel/Skeleton";
import DeliveryCard from "../DeliveryCard";
import CompleteDeliveryModal from "../CompleteDeliveryModal";

const CourierDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const load = async (signal) => {
        try {
            const res = await api.get("/courier/deliveries", { signal });
            setDeliveries(res.data.deliveries);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const c = new AbortController();
        load(c.signal);
        return () => c.abort();
    }, []);

    return (
        <div className="w-full max-w-[900px]">
            <PanelPageHeader title="تحویل‌های فعال" subtitle="سفارش‌هایی که به شما تخصیص داده شده و باید تحویل دهید" />

            {loading ? (
                <div className="flex flex-col gap-3"><SkeletonOrderRow /><SkeletonOrderRow /></div>
            ) : deliveries.length === 0 ? (
                <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">
                    در حال حاضر تحویل فعالی ندارید.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {deliveries.map((o) => <DeliveryCard key={o._id} order={o} onComplete={setSelected} />)}
                </div>
            )}

            <CompleteDeliveryModal open={!!selected} onClose={() => setSelected(null)} order={selected} onCompleted={() => load()} />
        </div>
    );
};

export default CourierDeliveries;
