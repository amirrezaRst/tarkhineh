"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/Skeleton";
import { Avatar, faDate } from "../adminUtils";
import { setReviewStatus, deleteReview } from "@/services/AdminService";
import { CheckIcon, CloseIcon, TrashIcon } from "../icons";

const Stars = ({ n, className = "" }) => (
    <span className={`text-[hsl(var(--amber-400))] ${className}`} aria-label={`${n} از ۵`}>{"★".repeat(n)}<span className="text-border-strong">{"★".repeat(5 - n)}</span></span>
);

const STATUS_TABS = [
    { key: "all", label: "همه" }, { key: "pending", label: "در انتظار تأیید" },
    { key: "approved", label: "تأییدشده" }, { key: "rejected", label: "ردشده" },
];
const STATUS_PILL = {
    pending: "bg-status-pending-subtle text-status-pending", approved: "bg-status-delivered-subtle text-status-delivered", rejected: "bg-status-cancelled-subtle text-status-cancelled",
};
const STATUS_LABEL = { pending: "در انتظار تأیید", approved: "منتشرشده", rejected: "ردشده" };

// Shared review card — used both in the normal list and as the pinned
// "opened from the bell" highlight so both look and behave identically.
const ReviewCard = ({ r, onAct, highlighted }) => (
    <Card className={`p-4 ${highlighted ? "ring-2 ring-primary/50" : ""}`}>
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
                <Avatar name={r.user?.fullName} phone={r.user?.phoneNumber} role="user" size={36} />
                <div>
                    <div className="font-bold text-super-sm">{r.user?.fullName || "کاربر"}</div>
                    <div className="text-super-xs text-muted-fg">{faDate(r.createdAt)}</div>
                </div>
            </div>
            <div className="flex items-center gap-2.5">
                <Stars n={r.rating} className="text-super-sm" />
                <span className={`text-super-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_PILL[r.status] || ""}`}>{STATUS_LABEL[r.status] || r.status}</span>
            </div>
        </div>
        <p className="text-super-sm mt-3 leading-7">{r.text}</p>
        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
            <div className="flex gap-2 flex-wrap">
                {r.menuItem?.name && <span className="text-super-xs bg-surface-sunken text-muted-fg px-2 py-0.5 rounded-full">{r.menuItem.name}</span>}
                {r.branch?.name && <span className="text-super-xs bg-surface-sunken text-muted-fg px-2 py-0.5 rounded-full">شعبه {r.branch.name}</span>}
            </div>
            <div className="flex gap-2">
                {r.status !== "approved" && <button onClick={() => onAct(() => setReviewStatus(r._id, "approved"))} className="inline-flex items-center gap-1.5 text-super-xs font-bold px-3 py-1.5 rounded-lg bg-status-delivered-subtle text-status-delivered hover:bg-status-delivered hover:text-white transition-colors"><CheckIcon className="w-3.5 h-3.5" /> تأیید و انتشار</button>}
                {r.status !== "rejected" && <button onClick={() => onAct(() => setReviewStatus(r._id, "rejected"))} className="inline-flex items-center gap-1.5 text-super-xs font-bold px-3 py-1.5 rounded-lg border border-border text-muted-fg hover:text-status-cancelled hover:border-status-cancelled/40 transition-colors"><CloseIcon className="w-3.5 h-3.5" /> رد</button>}
                <button onClick={() => { if (confirm("این نظر برای همیشه حذف شود؟")) onAct(() => deleteReview(r._id)); }} aria-label="حذف" className="w-8 h-8 grid place-items-center rounded-lg border border-border text-muted-fg hover:text-destructive hover:border-destructive/40"><TrashIcon className="w-4 h-4" /></button>
            </div>
        </div>
    </Card>
);

const AdminReviews = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("pending");
    const [rating, setRating] = useState("all");
    const [branch, setBranch] = useState("all");
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pinned, setPinned] = useState(null);

    const load = useCallback(async (signal) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/reviews?status=${status}&rating=${rating}&branch=${branch}&page=${page}`, { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [status, rating, branch, page]);

    useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);

    // Deep link from the activity bell / global search: pin that exact review
    // above the (unaffected) filtered list, then clean the URL.
    useEffect(() => {
        const openId = searchParams.get("openId");
        if (!openId) return;
        api.get(`/admin/reviews?id=${openId}`)
            .then((res) => { const r = res.data.reviews?.[0]; if (r) setPinned(r); else toast.error("نظر یافت نشد."); })
            .catch(() => toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."))
            .finally(() => router.replace("/admin/reviews"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reviews = data?.reviews || [];
    const dist = data?.distribution || {};
    const sc = data?.statusCounts || {};
    const byBranch = data?.byBranch || [];
    const maxDist = Math.max(...Object.values(dist), 1);
    const reset = (fn) => { setPage(1); fn(); };

    const act = async (fn) => { await fn(); load(); setPinned(null); };

    return (
        <div className="w-full">
            <PanelPageHeader title="نظرات و امتیازها" subtitle="بررسی و تأیید نظرات پیش از انتشار، و سنجش رضایت شعبه‌ها" />

            {pinned && (
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-super-xs font-bold text-primary">نظر انتخاب‌شده از اعلان‌ها</span>
                        <button onClick={() => setPinned(null)} className="text-super-xs text-muted-fg hover:text-foreground">بستن ×</button>
                    </div>
                    <ReviewCard r={pinned} onAct={act} highlighted />
                </div>
            )}

            {/* moderation status tabs */}
            <div className="flex gap-1.5 mb-5 flex-wrap">
                {STATUS_TABS.map((t) => {
                    const isPending = t.key === "pending";
                    const n = sc[t.key] ?? 0;
                    return (
                        <button key={t.key} onClick={() => reset(() => setStatus(t.key))}
                            className={`inline-flex items-center gap-2 text-super-xs font-bold px-3.5 py-2 rounded-lg border transition-colors ${status === t.key ? "bg-primary text-primary-fg border-primary" : "bg-surface border-border text-muted-fg hover:text-foreground"}`}>
                            {t.label}
                            <span className={`tabular-nums px-1.5 rounded-full ${isPending && n > 0 && status !== t.key ? "bg-status-pending text-white" : "opacity-70"}`}>{PersianNumber(n)}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start">
                {/* rail */}
                <div className="flex flex-col gap-4">
                    <Card className="p-5 text-center">
                        {loading ? <Skeleton className="h-16" /> : (
                            <>
                                <div className="text-4xl font-extrabold tabular-nums">{data?.avg != null ? PersianNumber(data.avg) : "—"}</div>
                                <Stars n={Math.round(data?.avg || 0)} className="text-lg" />
                                <div className="text-super-xs text-muted-fg mt-1">میانگین از {PersianNumber(data?.totalAll ?? 0)} نظر</div>
                            </>
                        )}
                    </Card>

                    <Card className="p-5">
                        <div className="text-super-xs font-bold text-muted-fg mb-3">توزیع امتیاز</div>
                        {[5, 4, 3, 2, 1].map((n) => (
                            <button key={n} onClick={() => reset(() => setRating(rating === String(n) ? "all" : String(n)))}
                                className={`w-full flex items-center gap-2 py-1.5 ${rating === String(n) ? "" : "opacity-90 hover:opacity-100"}`}>
                                <span className="text-super-xs w-3 tabular-nums">{PersianNumber(n)}</span>
                                <span className="text-[hsl(var(--amber-400))] text-super-xs">★</span>
                                <span className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden"><span className="block h-full rounded-full bg-[hsl(var(--amber-400))]" style={{ width: `${Math.round(((dist[n] || 0) / maxDist) * 100)}%` }} /></span>
                                <span className="text-super-xs tabular-nums text-muted-fg w-6 text-left">{PersianNumber(dist[n] || 0)}</span>
                            </button>
                        ))}
                    </Card>

                    <Card className="p-5">
                        <div className="text-super-xs font-bold text-muted-fg mb-3">رضایت به‌تفکیک شعبه</div>
                        {byBranch.length === 0 ? <p className="text-super-xs text-muted-fg py-2">داده‌ای نیست.</p> : (
                            <div className="space-y-2.5">
                                {byBranch.map((b) => (
                                    <button key={b.name} onClick={() => reset(() => setBranch(branch === b.name ? "all" : b.name))}
                                        className="w-full flex items-center gap-2 text-super-sm">
                                        <span className="flex-1 text-right font-semibold truncate">{b.name}</span>
                                        <span className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden max-w-[90px]"><span className="block h-full rounded-full bg-gradient-to-l from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]" style={{ width: `${(b.avg / 5) * 100}%` }} /></span>
                                        <span className="tabular-nums font-extrabold w-8 text-left">{PersianNumber(b.avg)}</span>
                                        <span className="tabular-nums text-super-xs text-subtle-fg w-8 text-left">({PersianNumber(b.count)})</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* list */}
                <div className="min-w-0">
                    {(rating !== "all" || branch !== "all") && (
                        <div className="flex items-center gap-2 mb-3 text-super-xs">
                            <span className="text-muted-fg">فیلتر:</span>
                            {rating !== "all" && <span className="bg-surface-sunken px-2 py-0.5 rounded-full">{PersianNumber(rating)} ستاره</span>}
                            {branch !== "all" && <span className="bg-surface-sunken px-2 py-0.5 rounded-full">شعبه {branch}</span>}
                            <button onClick={() => reset(() => { setRating("all"); setBranch("all"); })} className="text-primary font-bold">پاک‌کردن</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
                    ) : reviews.length === 0 ? (
                        <Card className="p-12 text-center text-muted-fg text-super-sm">نظری در این وضعیت یافت نشد.</Card>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((r) => <ReviewCard key={r._id} r={r} onAct={act} />)}
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

// useSearchParams requires a Suspense boundary during prerender.
const AdminReviewsPage = () => (
    <Suspense fallback={null}>
        <AdminReviews />
    </Suspense>
);

export default AdminReviewsPage;
