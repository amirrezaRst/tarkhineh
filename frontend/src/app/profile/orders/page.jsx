// "use client";

// import { useSearchParams } from "next/navigation";
// import OrderCard from "./OrderCard";
// import OrderCategories from "./OrderCategories";

// const OrdersPage = () => {
//     const category = useSearchParams().get("category") || "all";

//     return (
//         <>
//             <div className="flex flex-row items-center justify-between xl:gap-7 gap-4">
//                 <OrderCategories category={category} />
//             </div>

//             <section className="space-y-8 md:mt-14 mt-10">
//                 <OrderCard />
//             </section>
//         </>
//     );
// };

// export default OrdersPage;



"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import OrderCard from "./OrderCard";
import OrderCategories from "./OrderCategories";
import useUserStore from "@/stores/useUserStore";

const OrdersPage = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "all";
    const { user } = useUserStore();


    const [ordersData, setOrdersData] = useState({});
    const [fetched, setFetched] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async (status) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/user/${user?._id}?status=${status}`);
            const data = await res.json();

            if (res.ok) {
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
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            if (category === "all") {
                if (!fetched.includes("preparing") || !fetched.includes("delivered") || !fetched.includes("cancelled")) {
                    fetchOrders("all");
                }
            } else {
                if (!fetched.includes(category)) {
                    fetchOrders(category);
                }
            }
        }
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
                {loading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}

                {getVisibleOrders().length > 0 ? (
                    getVisibleOrders().map((order) => (
                        <OrderCard key={order._id} {...order} onStatusUpdate={() => fetchOrders(category)} />
                    ))
                ) : (
                    !loading && <p className="text-center text-gray-400">سفارشی پیدا نشد.</p>
                )}
            </section>
        </>
    );
};

export default OrdersPage;
