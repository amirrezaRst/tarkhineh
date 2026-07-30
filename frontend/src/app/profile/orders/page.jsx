"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import OrderCard from "./OrderCard";
import OrderCardSkeleton from "./OrderCardSkeleton";
import OrderCategories from "./OrderCategories";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";

const OrdersPage = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "all";
    const { user } = useUserStore();


    const [ordersData, setOrdersData] = useState({});
    const [fetched, setFetched] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async (status, signal) => {
        setLoading(true);
        try {
            const data = await api.get(`/order/user/${user?._id}?status=${status}`, { signal });

            if (status === "all") {
                const grouped = {
                    preparing: [],
                    delivered: [],
                    cancelled: [],
                };

                for (const order of data.orders) {
                    if (["pending", "preparing", "on_the_way"].includes(order.status)) {
                        grouped.preparing.push(order);
                    } else if (order.status === "delivered") {
                        grouped.delivered.push(order);
                    } else if (order.status === "cancelled") {
                        grouped.cancelled.push(order);
                    }
                }

                setOrdersData(prev => ({
                    ...prev,
                    ...grouped,
                }));

                setFetched(prev => [...new Set([...prev, "preparing", "delivered", "cancelled"])]);
            } else {
                setOrdersData(prev => ({
                    ...prev,
                    [status]: data.orders,
                }));

                setFetched(prev => [...prev, status]);
            }
        } catch (err) {
            if (err.name !== "AbortError") console.error("Error fetching orders:", err.message);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        const controller = new AbortController();
        if (category === "all") {
            if (!fetched.includes("preparing") || !fetched.includes("delivered") || !fetched.includes("cancelled")) {
                fetchOrders("all", controller.signal);
            }
        } else {
            if (!fetched.includes(category)) {
                fetchOrders(category, controller.signal);
            }
        }
        return () => controller.abort();
    }, [user, category]);

    const getVisibleOrders = () => {
        if (category === "all") {
            return [
                ...(ordersData.preparing || []),
                ...(ordersData.delivered || []),
                ...(ordersData.cancelled || []),
            ];
        }
        return ordersData[category] || [];
    };

    return (
        <>
            <div className="flex flex-row items-center justify-between xl:gap-7 gap-4">
                <OrderCategories category={category} />
            </div>

            <section className="space-y-8 md:mt-14 mt-10">
                {loading && [0, 1, 2].map((i) => <OrderCardSkeleton key={i} />)}

                {!loading && (getVisibleOrders().length > 0 ? (
                    getVisibleOrders().map((order) => (
                        <OrderCard key={order._id} {...order} onStatusUpdate={() => fetchOrders(category)} />
                    ))
                ) : (
                    <p className="text-center text-muted-fg">سفارشی پیدا نشد.</p>
                ))}
            </section>
        </>
    );
};

export default OrdersPage;
