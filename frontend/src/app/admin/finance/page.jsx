"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import MetricBar from "@/components/panel/MetricBar";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import Donut from "@/components/panel/charts/Donut";
import { Skeleton } from "@/components/Skeleton";
import { PAYMENT_LABEL } from "../adminUtils";
import { refundOrder } from "@/services/AdminService";

const PERIODS = [{ key: "today", label: "امروز" }, { key: "week", label: "هفته" }, { key: "month", label: "ماه" }, { key: "all", label: "همه" }];
const faTime = (d) => new Date(d).toLocaleString("fa-IR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const PAY_TONE = { paid: "bg-status-delivered-subtle text-status-delivered", unpaid: "bg-status-pending-subtle text-status-pending", failed: "bg-status-cancelled-subtle text-status-cancelled" };

const AdminFinance = () => {
    const [period, setPeriod] = useState("month");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (signal) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/finance?period=${period}`, { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [period]);

    useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);

    const s = data?.summary || {};
    const ms = data?.methodSplit || {};
    const perBranch = data?.perBranch || [];
    const refunds = data?.refunds || {};
    const txns = data?.transactions || [];
    const maxBranch = Math.max(...perBranch.map((b) => b.sum), 1);
    const methodTotal = (ms.online?.count || 0) + (ms.cash?.count || 0);

    const doRefund = async (o) => {
        if (!confirm("بازپرداخت این سفارش ثبت شود؟")) return;
        await refundOrder(o._id, () => load());
    };

    return (
        <div className="w-full">
            <PanelPageHeader title="مالی و پرداخت‌ها" subtitle="درآمد، تفکیک روش پرداخت، بازپرداخت‌ها و تسویهٔ شعبه‌ها"
                action={
                    <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                        {PERIODS.map((p) => <button key={p.key} onClick={() => setPeriod(p.key)} className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${period === p.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{p.label}</button>)}
                    </div>
                } />

            {loading ? <Skeleton className="h-24 rounded-2xl mb-4" /> : (
                <div className="mb-4">
                    <MetricBar items={[
                        { value: FormatPrice(s.gross?.sum ?? 0), label: `درآمد محقق‌شده (ت) · ${PersianNumber(s.gross?.count ?? 0)} سفارش` },
                        { value: FormatPrice(s.paid?.sum ?? 0), label: `پرداخت‌شده (ت) · ${PersianNumber(s.paid?.count ?? 0)}` },
                        { value: FormatPrice(s.unpaid?.sum ?? 0), label: `پرداخت‌نشده (ت) · ${PersianNumber(s.unpaid?.count ?? 0)}` },
                    ]} />
                </div>
            )}

            <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
                {/* method split */}
                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">تفکیک روش پرداخت</h2>
                    {loading ? <Skeleton className="h-40" /> : methodTotal === 0 ? <p className="text-muted-fg text-super-sm py-8 text-center">پرداختی ثبت نشده.</p> : (
                        <div className="flex items-center gap-5">
                            <Donut size={140} thickness={18} centerValue={PersianNumber(methodTotal)} centerLabel="تراکنش"
                                segments={[{ label: "آنلاین", value: ms.online?.count || 0, color: "hsl(var(--brand-500))" }, { label: "نقدی", value: ms.cash?.count || 0, color: "hsl(var(--brand-200))" }]} />
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-super-sm"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(var(--brand-500))" }} /><span className="text-muted-fg">آنلاین</span><b className="mr-auto tabular-nums">{FormatPrice(ms.online?.sum || 0)} ت</b></div>
                                <div className="flex items-center gap-2 text-super-sm"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(var(--brand-200))" }} /><span className="text-muted-fg">نقدی</span><b className="mr-auto tabular-nums">{FormatPrice(ms.cash?.sum || 0)} ت</b></div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* per-branch settlement */}
                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">تسویهٔ شعبه‌ها</h2>
                    {loading ? <Skeleton className="h-40" /> : perBranch.length === 0 ? <p className="text-muted-fg text-super-sm py-8 text-center">داده‌ای نیست.</p> : (
                        <div className="space-y-3">
                            {perBranch.map((b) => (
                                <div key={b.name}>
                                    <div className="flex justify-between text-super-sm mb-1"><span className="font-bold">{b.name} <span className="text-super-xs text-muted-fg">({PersianNumber(b.count)} سفارش)</span></span><span className="tabular-nums font-extrabold">{FormatPrice(b.sum)} ت</span></div>
                                    <div className="h-2 rounded-full bg-surface-sunken overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-l from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]" style={{ width: `${Math.round((b.sum / maxBranch) * 100)}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* refunds banner */}
            {!loading && refunds.requested?.count > 0 && (
                <div className="mt-4 flex items-center gap-3 bg-warning-subtle border border-warning/25 text-warning-fg rounded-2xl px-4 py-3 text-super-sm font-semibold">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M12 3l9 16H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    {PersianNumber(refunds.requested.count)} درخواست بازپرداخت در انتظار رسیدگی — مجموع {FormatPrice(refunds.requested.sum)} تومان. در جدول زیر با دکمهٔ «تأیید بازپرداخت» رسیدگی کنید.
                </div>
            )}

            {/* transactions */}
            <Card className="mt-4 overflow-hidden">
                <div className="p-5 pb-3"><h2 className="text-super-base font-extrabold">تراکنش‌های اخیر</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-super-sm">
                        <thead>
                            <tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">کد</th><th className="px-4 py-3 font-bold">مشتری</th><th className="px-4 py-3 font-bold">شعبه</th>
                                <th className="px-4 py-3 font-bold">مبلغ (ت)</th><th className="px-4 py-3 font-bold">پرداخت</th><th className="px-4 py-3 font-bold">روش</th><th className="px-4 py-3 font-bold">زمان</th><th className="px-4 py-3 font-bold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [0, 1, 2, 3].map((i) => <tr key={i} className="border-t border-border"><td colSpan={8} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                                : txns.length === 0 ? <tr><td colSpan={8} className="text-center py-10 text-muted-fg">تراکنشی یافت نشد.</td></tr>
                                    : txns.map((o) => (
                                        <tr key={o._id} className="border-t border-border hover:bg-surface-sunken/50">
                                            <td className="px-4 py-3 font-extrabold text-primary-hover tabular-nums">#{PersianNumber(String(o._id).slice(-5))}</td>
                                            <td className="px-4 py-3">{o.user?.fullName || "مشتری"}</td>
                                            <td className="px-4 py-3">{o.branch?.name || "—"}</td>
                                            <td className="px-4 py-3 tabular-nums font-bold">{FormatPrice(o.finalPrice)}</td>
                                            <td className="px-4 py-3"><span className={`text-super-xs font-bold px-2.5 py-1 rounded-full ${PAY_TONE[o.paymentStatus] || "bg-surface-sunken text-muted-fg"}`}>{PAYMENT_LABEL[o.paymentStatus] || "—"}</span></td>
                                            <td className="px-4 py-3 text-muted-fg">{o.paymentMethod === "cash" ? "نقدی" : "آنلاین"}</td>
                                            <td className="px-4 py-3 tabular-nums text-muted-fg whitespace-nowrap">{faTime(o.createdAt)}</td>
                                            <td className="px-4 py-3">
                                                {o.refundStatus === "requested" ? <button onClick={() => doRefund(o)} className="text-super-xs font-bold bg-warning-subtle text-warning-fg px-2.5 py-1.5 rounded-lg hover:bg-warning hover:text-white transition-colors whitespace-nowrap">تأیید بازپرداخت</button>
                                                    : o.refundStatus === "processed" ? <span className="text-super-xs text-muted-fg">بازپرداخت‌شده</span> : null}
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminFinance;
