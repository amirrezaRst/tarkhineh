"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import OrderRow from "./OrderRow";

const TABS = [
    { key: "pending", label: "در انتظار تایید" },
    { key: "preparing", label: "در حال آماده‌سازی" },
    { key: "on_the_way", label: "ارسال شده" },
    { key: "delivered", label: "تحویل شده" },
    { key: "cancelled", label: "لغو شده" },
];

const BranchPanelOrders = () => {
    const branch = useUserStore((state) => state.user?.branch);

    const [activeTab, setActiveTab] = useState("pending");
    const [orders, setOrders] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (signal) => {
        if (!branch) return;
        setLoading(true);
        try {
            const res = await api.get(`/branch-manager/orders/${branch}?status=${activeTab}`, { signal });
            setOrders(res.data.orders);
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
            .catch((err) => { if (err.name !== "AbortError") { /* couriers are only needed for the assign action; fail silently */ } });
        return () => controller.abort();
    }, [branch]);

    return (
        <>
            <h6 className="text-xl font-semibold">سفارش‌های شعبه</h6>

            <div className="px-6 mt-6 flex items-center gap-2 overflow-x-auto pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-super-sm font-medium transition-colors ${activeTab === tab.key
                            ? "bg-primary text-primary-fg"
                            : "bg-surface-sunken text-muted-fg"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="px-6 mt-6 flex flex-col gap-3">
                {!loading && orders.length === 0 && (
                    <p className="text-muted-fg text-super-sm">سفارشی در این وضعیت وجود ندارد.</p>
                )}
                {orders.map((order) => (
                    <OrderRow key={order._id} order={order} couriers={couriers} onChanged={() => fetchOrders()} />
                ))}
            </div>
        </>
    );
};

export default BranchPanelOrders;
