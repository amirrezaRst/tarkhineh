"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { Avatar, faDate } from "../adminUtils";
import { deleteReview } from "@/services/AdminService";

const Stars = ({ n }) => (
    <span className="text-[hsl(var(--amber-400))] tabular-nums" aria-label={`${n} از ۵`}>{"★".repeat(n)}<span className="text-border-strong">{"★".repeat(5 - n)}</span></span>
);

const AdminReviews = () => {
    const [rating, setRating] = useState("all");
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (signal) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/reviews?rating=${rating}&page=${page}`, { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [rating, page]);

    useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);

    const reviews = data?.reviews || [];
    const dist = data?.distribution || {};
    const maxDist = Math.max(...Object.values(dist), 1);

    const onDelete = async (r) => { if (confirm("این نظر حذف شود؟")) await deleteReview(r._id, () => load()); };

    return (
        <div className="w-full">
            <PanelPageHeader title="نظرات و امتیازها" subtitle="مدیریت و پایش نظرات مشتریان در همهٔ شعبه‌ها" />

            <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start">
                {/* summary rail */}
                <div className="flex flex-col gap-4">
                    <Card className="p-5 text-center">
                        {loading ? <Skeleton className="h-16" /> : (
                            <>
                                <div className="text-4xl font-extrabold tabular-nums">{data?.avg != null ? PersianNumber(data.avg) : "—"}</div>
                                <div className="text-[hsl(var(--amber-400))] text-lg mt-1">{"★".repeat(Math.round(data?.avg || 0))}<span className="text-border-strong">{"★".repeat(5 - Math.round(data?.avg || 0))}</span></div>
                                <div className="text-super-xs text-muted-fg mt-1">میانگین از {PersianNumber(data?.totalAll ?? 0)} نظر</div>
                            </>
                        )}
                    </Card>
                    <Card className="p-5">
                        <div className="text-super-xs font-bold text-muted-fg mb-3">توزیع امتیاز</div>
                        {[5, 4, 3, 2, 1].map((n) => (
                            <button key={n} onClick={() => { setPage(1); setRating(rating === String(n) ? "all" : String(n)); }}
                                className={`w-full flex items-center gap-2 py-1.5 ${rating === String(n) ? "opacity-100" : "opacity-90 hover:opacity-100"}`}>
                                <span className="text-super-xs w-3 tabular-nums">{PersianNumber(n)}</span>
                                <span className="text-[hsl(var(--amber-400))] text-super-xs">★</span>
                                <span className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden"><span className="block h-full rounded-full bg-[hsl(var(--amber-400))]" style={{ width: `${Math.round(((dist[n] || 0) / maxDist) * 100)}%` }} /></span>
                                <span className="text-super-xs tabular-nums text-muted-fg w-6 text-left">{PersianNumber(dist[n] || 0)}</span>
                            </button>
                        ))}
                        {rating !== "all" && <button onClick={() => { setPage(1); setRating("all"); }} className="text-super-xs text-primary font-bold mt-2">نمایش همه</button>}
                    </Card>
                </div>

                {/* list */}
                <div className="min-w-0">
                    {loading ? (
                        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
                    ) : reviews.length === 0 ? (
                        <Card className="p-12 text-center text-muted-fg text-super-sm">نظری یافت نشد.</Card>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((r) => (
                                <Card key={r._id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar name={r.user?.fullName} phone={r.user?.phoneNumber} role="user" size={36} />
                                            <div>
                                                <div className="font-bold text-super-sm">{r.user?.fullName || "کاربر"}</div>
                                                <div className="text-super-xs text-muted-fg">{faDate(r.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Stars n={r.rating} />
                                            <button onClick={() => onDelete(r)} aria-label="حذف" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40">🗑</button>
                                        </div>
                                    </div>
                                    <p className="text-super-sm mt-3 leading-7">{r.text}</p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {r.menuItem?.name && <span className="text-super-xs bg-surface-sunken text-muted-fg px-2 py-0.5 rounded-full">{r.menuItem.name}</span>}
                                        {r.branch?.name && <span className="text-super-xs bg-surface-sunken text-muted-fg px-2 py-0.5 rounded-full">شعبه {r.branch.name}</span>}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {data && data.pages > 1 && (
                        <div className="flex items-center justify-between mt-4 text-super-xs">
                            <span className="text-muted-fg">صفحهٔ {PersianNumber(data.page)} از {PersianNumber(data.pages)}</span>
                            <div className="flex gap-2">
                                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-border font-bold disabled:opacity-40">قبلی</button>
                                <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-border font-bold disabled:opacity-40">بعدی</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReviews;
