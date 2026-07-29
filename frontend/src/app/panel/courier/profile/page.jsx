"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import Card from "@/components/panel/Card";
import BarChart from "@/components/panel/charts/BarChart";
import { Skeleton } from "@/components/Skeleton";
import { setAvailability } from "@/services/CourierService";
import { courierImg, initials, VEHICLE_LABEL } from "../../branch/couriers/courierUtils";

const weekdayShort = (iso) => new Date(iso).toLocaleDateString("fa-IR", { weekday: "short" });

const CourierProfile = () => {
    const storeUser = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const load = async (signal) => {
        try {
            const res = await api.get("/courier/profile", { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const c = new AbortController();
        load(c.signal);
        return () => c.abort();
    }, []);

    const p = data?.profile;
    const perf = data?.performance || {};
    const status = p?.courierStatus || storeUser?.courierStatus || "available";

    const changeStatus = async (next) => {
        if (busy || next === status) return;
        setBusy(true);
        await setAvailability(next, (s) => { setUser({ ...storeUser, courierStatus: s }); load(); });
        setBusy(false);
    };

    const weekData = (perf.weekly || []).map((d) => ({ label: weekdayShort(d.date), value: d.count }));
    const weekTotal = weekData.reduce((s, d) => s + d.value, 0);

    if (loading) {
        return (
            <div className="w-full">
                <PanelPageHeader title="پروفایل و عملکرد" subtitle="اطلاعات شما، وضعیت فعالیت و آمار عملکرد" />
                <div className="grid lg:grid-cols-[340px_1fr] gap-4"><Skeleton className="h-96 rounded-2xl" /><Skeleton className="h-96 rounded-2xl" /></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <PanelPageHeader title="پروفایل و عملکرد" subtitle="اطلاعات شما، وضعیت فعالیت و آمار عملکرد" />

            <div className="grid lg:grid-cols-[340px_1fr] gap-4 items-start">
                {/* profile + availability */}
                <Card className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-[3px] rounded-[26px] bg-primary mb-3">
                            {courierImg(p?.image)
                                ? <img src={courierImg(p.image)} alt="" className="w-24 h-24 rounded-[23px] object-cover border-2 border-surface" />
                                : <div className="w-24 h-24 rounded-[23px] grid place-items-center text-white text-3xl font-extrabold border-2 border-surface bg-gradient-to-tl from-feature-from to-feature-mid">{initials(p?.fullName, p?.phoneNumber)}</div>}
                        </div>
                        <div className="text-lg font-extrabold">{p?.fullName || "بدون نام"}</div>
                        <div className="text-super-xs text-muted-fg">پیک شعبه · عضو از {p?.createdAt ? new Date(p.createdAt).toLocaleDateString("fa-IR", { month: "long", year: "numeric" }) : "—"}</div>
                    </div>

                    <div className="mt-5">
                        <Row k="شماره موبایل" v={p?.phoneNumber} tnum />
                        <Row k="وسیله" v={`${VEHICLE_LABEL[p?.vehicleType] || "—"}${p?.plateNumber ? ` · ${p.plateNumber}` : ""}`} />
                        {p?.nationalCode && <Row k="کد ملی" v={p.nationalCode} tnum />}
                    </div>

                    <div className="mt-5">
                        <div className="text-super-xs font-bold text-muted-fg mb-2">وضعیت فعالیت</div>
                        <div className="flex gap-2.5">
                            <button onClick={() => changeStatus("available")} disabled={busy} aria-pressed={status === "available"}
                                className={`flex-1 rounded-xl py-3 text-super-sm font-extrabold border-2 transition-colors min-h-[52px] ${status === "available" ? "border-primary bg-primary-subtle text-primary" : "border-border bg-surface text-muted-fg"}`}>
                                آنلاین<span className="block text-super-xs font-medium text-subtle-fg mt-0.5">آمادهٔ دریافت</span>
                            </button>
                            <button onClick={() => changeStatus("offline")} disabled={busy} aria-pressed={status === "offline"}
                                className={`flex-1 rounded-xl py-3 text-super-sm font-extrabold border-2 transition-colors min-h-[52px] ${status === "offline" ? "border-muted-fg bg-surface-sunken text-muted-fg" : "border-border bg-surface text-muted-fg"}`}>
                                آفلاین<span className="block text-super-xs font-medium text-subtle-fg mt-0.5">پایان شیفت</span>
                            </button>
                        </div>
                    </div>
                </Card>

                {/* performance */}
                <div className="flex flex-col gap-4">
                    <Card className="p-5">
                        <h2 className="text-super-base font-extrabold mb-4">عملکرد</h2>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl p-4 bg-primary-subtle border border-primary/15"><div className="text-super-base font-extrabold tabular-nums">{perf.avgMinutes != null ? `${PersianNumber(perf.avgMinutes)} دقیقه` : "—"}</div><div className="text-super-xs text-muted-fg mt-0.5">میانگین زمان تحویل</div></div>
                            <div className="rounded-xl p-4 bg-surface-sunken"><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(perf.total ?? 0)}</div><div className="text-super-xs text-muted-fg mt-0.5">کل تحویل‌ها</div></div>
                            <div className="rounded-xl p-4 bg-surface-sunken"><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(perf.weekTotal ?? 0)}</div><div className="text-super-xs text-muted-fg mt-0.5">این هفته</div></div>
                        </div>
                    </Card>
                    <Card className="p-5">
                        <div className="flex items-end justify-between mb-1">
                            <h2 className="text-super-base font-extrabold">تحویل‌های این هفته</h2>
                            <div className="text-super-xs text-muted-fg">مجموع: <b className="tabular-nums">{PersianNumber(weekTotal)}</b></div>
                        </div>
                        <BarChart data={weekData} height={110} formatValue={(v) => `${PersianNumber(v)} تحویل`} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Row = ({ k, v, tnum }) => (
    <div className="flex justify-between gap-3 text-super-sm py-2.5 border-b border-border last:border-0">
        <span className="text-muted-fg">{k}</span>
        <span className={`font-bold ${tnum ? "tabular-nums" : ""}`}>{v || "—"}</span>
    </div>
);

export default CourierProfile;
