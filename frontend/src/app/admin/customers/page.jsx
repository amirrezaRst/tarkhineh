"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import MetricBar from "@/components/panel/MetricBar";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { Avatar, faDate } from "../adminUtils";
import { SearchIcon } from "../icons";

const AdminCustomers = () => {
    const [q, setQ] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (signal) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/customers?q=${encodeURIComponent(q)}`, { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [q]);

    useEffect(() => { const c = new AbortController(); const t = setTimeout(() => load(c.signal), 250); return () => { clearTimeout(t); c.abort(); }; }, [load]);

    const s = data?.summary || {};
    const rows = data?.topCustomers || [];

    return (
        <div className="w-full">
            <PanelPageHeader title="تحلیل مشتریان" subtitle="مشتریان برتر، تکرار خرید و ماندگاری" />

            {loading && !data ? <Skeleton className="h-24 rounded-2xl mb-5" /> : (
                <div className="mb-5">
                    <MetricBar items={[
                        { value: PersianNumber(s.totalCustomers ?? 0), label: "کل مشتریان" },
                        { value: `${PersianNumber(s.repeat ?? 0)} (${PersianNumber(s.repeatPct ?? 0)}٪)`, label: "مشتری بازگشتی" },
                        { value: PersianNumber(s.avgOrders ?? 0), label: "میانگین سفارش هر مشتری" },
                        { value: PersianNumber(s.newThisMonth ?? 0), label: "مشتری جدید این ماه" },
                    ]} />
                </div>
            )}

            <div className="flex items-center gap-2 bg-surface-sunken border border-border rounded-xl px-3.5 py-2.5 mb-4 max-w-md">
                <SearchIcon className="w-4 h-4 text-muted-fg shrink-0" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی مشتری با نام یا شماره…" className="bg-transparent text-super-sm w-full focus:outline-none" />
            </div>

            <Card className="overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <h2 className="text-super-sm font-extrabold">مشتریان برتر (بر اساس مجموع خرید)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-super-sm">
                        <thead>
                            <tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">#</th><th className="px-4 py-3 font-bold">مشتری</th><th className="px-4 py-3 font-bold">شماره</th>
                                <th className="px-4 py-3 font-bold">سفارش</th><th className="px-4 py-3 font-bold">مجموع خرید (ت)</th><th className="px-4 py-3 font-bold">آخرین سفارش</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [0, 1, 2, 3].map((i) => <tr key={i} className="border-t border-border"><td colSpan={6} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                                : rows.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-muted-fg">مشتری‌ای یافت نشد.</td></tr>
                                    : rows.map((c, i) => (
                                        <tr key={c._id} className="border-t border-border hover:bg-surface-sunken/50">
                                            <td className="px-4 py-3"><span className="w-7 h-7 rounded-lg bg-primary-subtle text-primary grid place-items-center font-extrabold text-super-xs tabular-nums">{PersianNumber(i + 1)}</span></td>
                                            <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={c.fullName} phone={c.phoneNumber} role="user" size={32} /><span className="font-semibold">{c.fullName || "بدون نام"}</span></div></td>
                                            <td className="px-4 py-3 tabular-nums text-muted-fg">{c.phoneNumber}</td>
                                            <td className="px-4 py-3 tabular-nums font-bold">{PersianNumber(c.orders)}</td>
                                            <td className="px-4 py-3 tabular-nums font-extrabold text-primary-hover">{FormatPrice(c.spent)}</td>
                                            <td className="px-4 py-3 tabular-nums text-muted-fg">{faDate(c.last)}</td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminCustomers;
