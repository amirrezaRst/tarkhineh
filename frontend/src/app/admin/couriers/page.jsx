"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import MetricBar from "@/components/panel/MetricBar";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { Avatar } from "../adminUtils";
import { courierImg, VEHICLE_LABEL } from "../../panel/branch/couriers/courierUtils";

const CourierCard = ({ c }) => {
    const online = c.courierStatus === "available";
    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <div className="relative">
                    <Avatar name={c.fullName} phone={c.phoneNumber} role="courier" src={courierImg(c.image)} size={48} />
                    <span className={`absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface ${online ? "bg-[hsl(var(--brand-400))]" : "bg-muted-fg"}`} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-super-sm truncate">{c.fullName || "بدون نام"}</div>
                    <div className="text-super-xs text-muted-fg tabular-nums">{c.phoneNumber}</div>
                    <div className="text-super-xs text-subtle-fg mt-0.5">{c.branch?.name || "بدون شعبه"} · {VEHICLE_LABEL[c.vehicleType] || "—"}</div>
                </div>
                <span className={`text-super-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${online ? "bg-status-delivered-subtle text-status-delivered" : "bg-surface-sunken text-muted-fg"}`}>{online ? "آنلاین" : "آفلاین"}</span>
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(c.active)}</div><div className="text-super-xs text-muted-fg">فعال</div></div>
                <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(c.deliveredToday)}</div><div className="text-super-xs text-muted-fg">امروز</div></div>
                <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(c.totalDeliveries)}</div><div className="text-super-xs text-muted-fg">کل تحویل</div></div>
            </div>
        </Card>
    );
};

const AdminCouriers = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const c = new AbortController();
        api.get("/admin/couriers", { signal: c.signal })
            .then((res) => setData(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));
        return () => c.abort();
    }, []);

    const s = data?.summary || {};
    const couriers = data?.couriers || [];

    return (
        <div className="w-full">
            <PanelPageHeader title="پیک‌های سراسری" subtitle="نمای کل همهٔ پیک‌های پلتفرم و وضعیت آن‌ها" />

            {loading ? <Skeleton className="h-24 rounded-2xl mb-4" /> : (
                <div className="mb-5">
                    <MetricBar items={[
                        { value: PersianNumber(s.total ?? 0), label: "کل پیک‌ها" },
                        { value: PersianNumber(s.online ?? 0), label: "آنلاین" },
                        { value: PersianNumber(s.offline ?? 0), label: "آفلاین" },
                    ]} />
                </div>
            )}

            {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
            ) : couriers.length === 0 ? (
                <Card className="p-12 text-center text-muted-fg text-super-sm">هنوز پیکی ثبت نشده است.</Card>
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {couriers.map((c) => <CourierCard key={c._id} c={c} />)}
                </div>
            )}
        </div>
    );
};

export default AdminCouriers;
