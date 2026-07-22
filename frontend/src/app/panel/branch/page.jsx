"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import StatTile from "@/components/panel/StatTile";
import OrderStatusBadge from "@/components/panel/OrderStatusBadge";
import { WalletMoneyIcon, ReceiptIcon, SolidClockIcon } from "@/assets/Icons";

const BranchPanel = () => {
    const branch = useUserStore((state) => state.user?.branch);

    const [stats, setStats] = useState(null);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!branch) return;

        const controller = new AbortController();

        (async () => {
            setLoading(true);
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    api.get(`/branch-manager/stats/${branch}?period=today`, { signal: controller.signal }),
                    api.get(`/branch-manager/orders/${branch}?status=pending&limit=5`, { signal: controller.signal }),
                ]);
                setStats(statsRes.data);
                setPendingOrders(ordersRes.data.orders);
            } catch (err) {
                if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [branch]);

    return (
        <>
            <h6 className="text-xl font-semibold">داشبورد شعبه</h6>

            <div className="px-6 mt-6 grid sm:grid-cols-3 gap-4">
                <StatTile
                    label="سفارش‌های امروز"
                    value={loading ? "..." : PersianNumber(stats?.ordersCount ?? 0)}
                    icon={ReceiptIcon}
                    accent="primary"
                />
                <StatTile
                    label="درآمد امروز"
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

            <div className="px-6 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">نیازمند رسیدگی</h2>
                    <Link href="/panel/branch/orders" className="text-primary text-super-sm font-medium">
                        مشاهده همه سفارش‌ها
                    </Link>
                </div>

                {!loading && pendingOrders.length === 0 && (
                    <p className="text-muted-fg text-super-sm">در حال حاضر سفارش در انتظار تاییدی وجود ندارد.</p>
                )}

                <div className="flex flex-col gap-2.5">
                    {pendingOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4"
                        >
                            <div>
                                <p className="text-foreground font-medium">{order.user?.fullName || order.user?.phoneNumber}</p>
                                <p className="text-muted-fg text-super-xs mt-1">{order.items.length} قلم کالا</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-foreground font-medium">{FormatPrice(order.finalPrice)} تومان</span>
                                <OrderStatusBadge status={order.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BranchPanel;
