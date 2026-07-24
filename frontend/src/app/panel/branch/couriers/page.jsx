"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { setCourierCapacity } from "@/services/BranchManagerService";
import CourierCard from "./CourierCard";
import AddCourierModal from "./AddCourierModal";
import CourierDetailModal from "./CourierDetailModal";

const BranchPanelCouriers = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";

    const [couriers, setCouriers] = useState([]);
    const [capacity, setCapacity] = useState(3);
    const [loading, setLoading] = useState(true);
    const [addOpen, setAddOpen] = useState(false);
    const [detailId, setDetailId] = useState(null);
    const [savingCap, setSavingCap] = useState(false);

    const fetchCouriers = async (signal) => {
        if (!branch) return;
        try {
            const res = await api.get(`/branch-manager/couriers/${branch}`, { signal });
            setCouriers(res.data.couriers);
            setCapacity(res.data.courierCapacity ?? 3);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        fetchCouriers(controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch]);

    const saveCapacity = async (next) => {
        if (next < 1 || next > 20) return;
        setSavingCap(true);
        setCapacity(next); // optimistic
        await setCourierCapacity(branch, next, (c) => setCapacity(c));
        setSavingCap(false);
    };

    return (
        <div className="w-full">
            <PanelPageHeader
                title="پیک‌های شعبه"
                subtitle={`وضعیت، بار کاری و عملکرد پیک‌های شعبه ${branchName}`}
                action={
                    <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 bg-primary text-primary-fg rounded-xl px-4 py-2.5 text-super-sm font-bold hover:bg-primary-hover">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        افزودن پیک
                    </button>
                }
            />

            {/* capacity setting */}
            <div className="flex items-center gap-3.5 flex-wrap bg-surface border border-border rounded-2xl px-4 py-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary grid place-items-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.7" /><path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.2A1.7 1.7 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.2A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9.4A1.7 1.7 0 0 0 11 3.2V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9.4a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4.6Z" stroke="currentColor" strokeWidth="1.1" /></svg>
                </div>
                <div className="min-w-0">
                    <div className="text-super-sm font-extrabold">ظرفیت هم‌زمان هر پیک</div>
                    <div className="text-super-xs text-muted-fg">این مقدار برای همهٔ پیک‌ها یکسان است و مبنای هشدار اضافه‌بار قرار می‌گیرد.</div>
                </div>
                <div className="mr-auto flex items-center border border-border rounded-xl overflow-hidden">
                    <button onClick={() => saveCapacity(capacity - 1)} disabled={savingCap || capacity <= 1} className="w-9 h-9 bg-surface-sunken text-lg font-extrabold text-muted-fg disabled:opacity-40">−</button>
                    <span className="w-11 text-center font-extrabold tabular-nums">{PersianNumber(capacity)}</span>
                    <button onClick={() => saveCapacity(capacity + 1)} disabled={savingCap || capacity >= 20} className="w-9 h-9 bg-surface-sunken text-lg font-extrabold text-muted-fg disabled:opacity-40">+</button>
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-[236px] rounded-2xl" />)}
                </div>
            ) : couriers.length === 0 ? (
                <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">
                    هنوز پیکی برای این شعبه ثبت نشده است. با دکمهٔ «افزودن پیک» شروع کنید.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {couriers.map((c) => (
                        <CourierCard key={c._id} courier={c} capacity={capacity} onOpen={() => setDetailId(c._id)} />
                    ))}
                </div>
            )}

            <AddCourierModal open={addOpen} onClose={() => setAddOpen(false)} branch={branch} onCreated={fetchCouriers} />
            <CourierDetailModal open={!!detailId} onClose={() => setDetailId(null)} branch={branch} courierId={detailId} capacity={capacity} onChanged={fetchCouriers} />
        </div>
    );
};

export default BranchPanelCouriers;
