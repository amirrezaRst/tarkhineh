"use client";

import { useEffect, useMemo, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { SkeletonOrderRow } from "@/components/panel/Skeleton";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail";

const TABS = [
    { key: "all", label: "همه" },
    { key: "pending", label: "در انتظار تایید" },
    { key: "preparing", label: "در حال آماده‌سازی" },
    { key: "on_the_way", label: "ارسال شده" },
    { key: "delivered", label: "تحویل شده" },
    { key: "cancelled", label: "لغو شده" },
];

const BranchPanelOrders = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";

    const [activeTab, setActiveTab] = useState("pending");
    const [orders, setOrders] = useState([]);
    const [counts, setCounts] = useState({});
    const [couriers, setCouriers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (signal) => {
        if (!branch) return;
        setLoading(true);
        try {
            const res = await api.get(`/branch-manager/orders/${branch}?status=${activeTab}&limit=50`, { signal });
            setOrders(res.data.orders);
            setCounts(res.data.counts || {});
            setSelectedId((prev) => {
                if (prev && res.data.orders.some((o) => o._id === prev)) return prev;
                return res.data.orders[0]?._id || null;
            });
        } catch (err) {
            if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        fetchOrders(controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch, activeTab]);

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        api.get(`/branch-manager/couriers/${branch}`, { signal: controller.signal })
            .then((res) => setCouriers(res.data.couriers))
            .catch((err) => { if (err.name !== "AbortError") { /* couriers only power the assign action; fail quietly */ } });
        return () => controller.abort();
    }, [branch]);

    const selectedOrder = useMemo(
        () => orders.find((o) => o._id === selectedId) || null,
        [orders, selectedId]
    );

    return (
        <div className="max-w-[1280px]">
            <PanelPageHeader
                title="سفارش‌ها"
                subtitle={`مدیریت و پیگیری سفارش‌های شعبه ${branchName}`}
            />

            {/* Status filter tabs */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
                {TABS.map((tab) => {
                    const on = activeTab === tab.key;
                    const cnt = counts[tab.key];
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-super-sm font-bold border transition-colors ${on
                                ? "bg-primary text-primary-fg border-primary"
                                : "bg-surface text-muted-fg border-border hover:border-border-strong"
                                }`}
                        >
                            {tab.label}
                            {cnt !== undefined && (
                                <span className={`text-super-xs font-extrabold tabular-nums rounded-full px-1.5 min-w-[20px] text-center ${on ? "bg-white/20 text-primary-fg" : "bg-surface-sunken text-muted-fg"
                                    }`}>
                                    {toFa(cnt)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-4 items-start">
                {/* Order list */}
                <div className="flex flex-col gap-3">
                    {loading ? (
                        <><SkeletonOrderRow /><SkeletonOrderRow /><SkeletonOrderRow /></>
                    ) : orders.length === 0 ? (
                        <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">
                            سفارشی در این وضعیت وجود ندارد.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                couriers={couriers}
                                selected={order._id === selectedId}
                                onSelect={() => setSelectedId(order._id)}
                                onChanged={() => fetchOrders()}
                            />
                        ))
                    )}
                </div>

                {/* Detail panel */}
                <div className="hidden xl:block sticky top-2">
                    {selectedOrder ? (
                        <OrderDetail order={selectedOrder} couriers={couriers} onChanged={() => fetchOrders()} />
                    ) : (
                        <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">
                            یک سفارش را برای مشاهده جزئیات انتخاب کنید.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Local, dependency-free Persian digit helper (avoids importing for a single use here).
function toFa(n) {
    return String(n ?? "").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

export default BranchPanelOrders;
