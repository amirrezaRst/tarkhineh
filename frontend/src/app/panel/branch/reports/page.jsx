"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import StatTile from "@/components/panel/StatTile";
import { WalletMoneyIcon, ReceiptIcon, SolidClockIcon } from "@/assets/Icons";

const PERIODS = [
    { key: "today", label: "امروز" },
    { key: "week", label: "این هفته" },
    { key: "month", label: "این ماه" },
];

const BranchPanelReports = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const [period, setPeriod] = useState("today");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        setLoading(true);

        api.get(`/branch-manager/stats/${branch}?period=${period}`, { signal: controller.signal })
            .then((res) => setStats(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [branch, period]);

    return (
        <>
            <h6 className="text-xl font-semibold">گزارشات شعبه</h6>

            <div className="flex items-center gap-2 mt-6">
                {PERIODS.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => setPeriod(p.key)}
                        className={`rounded-lg px-4 py-2 text-super-sm font-medium transition-colors ${period === p.key ? "bg-primary text-primary-fg" : "bg-surface-sunken text-muted-fg"
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <StatTile
                    label="تعداد سفارش‌ها"
                    value={loading ? "..." : PersianNumber(stats?.ordersCount ?? 0)}
                    icon={ReceiptIcon}
                    accent="primary"
                />
                <StatTile
                    label="فروش"
                    value={loading ? "..." : `${FormatPrice(stats?.revenue ?? 0)} تومان`}
                    icon={WalletMoneyIcon}
                    accent="info"
                />
                <StatTile
                    label="سفارش‌های فعال"
                    value={loading ? "..." : PersianNumber(stats?.activeOrders ?? 0)}
                    icon={SolidClockIcon}
                    accent="warning"
                />
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">پرفروش‌ترین آیتم‌ها</h2>

                {!loading && (stats?.topItems?.length ?? 0) === 0 && (
                    <p className="text-muted-fg text-super-sm">در این بازه زمانی سفارش تحویل‌شده‌ای ثبت نشده است.</p>
                )}

                <div className="flex flex-col gap-2.5">
                    {stats?.topItems?.map((item, index) => (
                        <div
                            key={item.menuItem._id}
                            className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-super-sm font-semibold shrink-0">
                                    {PersianNumber(index + 1)}
                                </span>
                                <p className="text-foreground font-medium">{item.menuItem.name}</p>
                            </div>
                            <span className="text-muted-fg text-super-sm">{PersianNumber(item.quantity)} فروش</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BranchPanelReports;
