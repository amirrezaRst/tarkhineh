"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import { Skeleton } from "@/components/panel/Skeleton";
import { LedgerCard, WeekBarsCard } from "../courierWidgets";
import { shortId, faTime, faDate } from "../courierClientUtils";

const RANGES = [
    { key: "today", label: "امروز" },
    { key: "week", label: "هفته" },
    { key: "month", label: "ماه" },
    { key: "all", label: "همه" },
];
const RANGE_LABEL = { today: "درآمد امروز", week: "درآمد این هفته", month: "درآمد این ماه", all: "درآمد کل" };
const weekdayShort = (iso) => new Date(iso).toLocaleDateString("fa-IR", { weekday: "short" });

const CourierEarnings = () => {
    const [range, setRange] = useState("week");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const c = new AbortController();
        setLoading(true);
        api.get(`/courier/earnings?range=${range}`, { signal: c.signal })
            .then((res) => setData(res.data))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));
        return () => c.abort();
    }, [range]);

    const totals = data?.totals || {};
    const cur = totals[range] || { fees: 0, count: 0 };
    const orders = data?.orders || [];
    const daily = data?.daily || [];
    const avg = cur.count ? Math.round(cur.fees / cur.count) : 0;

    const weekData = daily.map((d) => ({ label: weekdayShort(d.date), value: d.fees }));
    const weekTotalFees = daily.reduce((s, d) => s + d.fees, 0);
    const busiest = daily.reduce((b, d) => (d.count > (b?.count ?? -1) ? d : b), null);

    return (
        <div className="w-full">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold">درآمد و تسویه</h1>
                    <p className="text-muted-fg text-super-sm mt-1.5">مجموع هزینهٔ ارسال سفارش‌های تحویل‌شدهٔ شما</p>
                </div>
                <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1">
                    {RANGES.map((r) => (
                        <button key={r.key} onClick={() => setRange(r.key)}
                            className={`text-super-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${range === r.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{r.label}</button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
                {/* main */}
                <div className="min-w-0">
                    {loading ? <Skeleton className="h-40 rounded-[22px] mb-4" /> : (
                        <div className="relative overflow-hidden rounded-[22px] p-6 text-white bg-gradient-to-tl from-feature-from via-feature-mid to-feature-to shadow-soft-lg stagger-in mb-4">
                            <div className="absolute -top-12 -left-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                            <div className="relative text-super-sm text-white/75 font-semibold">{RANGE_LABEL[range]}</div>
                            <div className="relative text-4xl font-extrabold tabular-nums mt-1">{FormatPrice(cur.fees)} <span className="text-lg font-bold">تومان</span></div>
                            <div className="relative text-super-xs text-white/70 mt-1.5">
                                از {PersianNumber(cur.count)} تحویل{cur.count ? ` · میانگین ${FormatPrice(avg)} ت به‌ازای هر تحویل` : ""}
                            </div>
                        </div>
                    )}

                    {loading ? <Skeleton className="h-24 rounded-2xl mb-5" /> : (
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {[
                                { v: totals.today?.fees ?? 0, l: `امروز · ${PersianNumber(totals.today?.count ?? 0)} تحویل` },
                                { v: totals.month?.fees ?? 0, l: "این ماه" },
                                { v: totals.all?.fees ?? 0, l: `کل · ${PersianNumber(totals.all?.count ?? 0)} تحویل` },
                            ].map((c, i) => (
                                <Card key={i} className="p-4">
                                    <div className="text-super-base font-extrabold tabular-nums">{FormatPrice(c.v)}</div>
                                    <div className="text-super-xs text-muted-fg mt-1">{c.l}</div>
                                </Card>
                            ))}
                        </div>
                    )}

                    <h2 className="text-super-base font-extrabold mb-3">ریز تحویل‌ها</h2>
                    <Card className="overflow-hidden">
                        <div className="hidden sm:grid grid-cols-[auto_1.4fr_1fr_1fr_auto] gap-3 px-5 py-3 bg-surface-sunken text-super-xs font-bold text-muted-fg">
                            <span>سفارش</span><span>مشتری</span><span>مبلغ سفارش</span><span>هزینهٔ ارسال</span><span>زمان</span>
                        </div>
                        {loading ? (
                            <div className="p-5 space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-8" />)}</div>
                        ) : orders.length === 0 ? (
                            <p className="text-muted-fg text-super-sm text-center py-10">در این بازه تحویلی ثبت نشده است.</p>
                        ) : (
                            orders.map((o) => (
                                <div key={o._id} className="grid grid-cols-2 sm:grid-cols-[auto_1.4fr_1fr_1fr_auto] gap-x-3 gap-y-1 items-center px-5 py-3.5 border-t border-border text-super-sm">
                                    <span className="font-extrabold text-primary-hover text-super-xs">#{shortId(o._id)}</span>
                                    <span className="font-semibold truncate">{o.user?.fullName || o.user?.phoneNumber || "مشتری"}<span className="block sm:hidden text-super-xs text-subtle-fg font-normal">{faTime(o.deliveredAt)} · {faDate(o.deliveredAt)}</span></span>
                                    <span className="tabular-nums text-muted-fg">{FormatPrice(o.finalPrice)}</span>
                                    <span className="tabular-nums font-extrabold text-primary-hover">{FormatPrice(o.deliveryFee)}</span>
                                    <span className="tabular-nums text-muted-fg hidden sm:block">{faTime(o.deliveredAt)}</span>
                                </div>
                            ))
                        )}
                    </Card>
                </div>

                {/* rail */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <><Skeleton className="h-44 rounded-2xl" /><Skeleton className="h-36 rounded-2xl" /></>
                    ) : (
                        <>
                            <WeekBarsCard title="درآمد روزهای هفته (تومان)" data={weekData} total={FormatPrice(weekTotalFees)} totalLabel="جمع هفته" />
                            <LedgerCard title="جمع‌بندی" rows={[
                                { k: "تعداد تحویل (بازه)", v: PersianNumber(cur.count) },
                                { k: "میانگین هر تحویل", v: `${FormatPrice(avg)} ت` },
                                { k: "پرکارترین روز هفته", v: busiest && busiest.count ? `${weekdayShort(busiest.date)} (${PersianNumber(busiest.count)})` : "—", tnum: false },
                            ]} />
                            <div className="bg-[hsl(var(--brand-50))] border border-[hsl(var(--brand-200))] rounded-2xl px-4 py-3.5 text-super-xs text-[hsl(var(--brand-700))] leading-7">
                                💰 درآمد بر مبنای هزینهٔ ارسال سفارش‌های تحویل‌شده محاسبه می‌شود.
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourierEarnings;
