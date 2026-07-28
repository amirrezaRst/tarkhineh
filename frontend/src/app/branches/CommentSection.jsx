"use client";

import { useEffect, useMemo, useState } from "react";
import CommentCard from "@/components/branchesPage/CommentCard";
import { fetchBranchReviews } from "@/services/MenuService";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { StarIcon, OutlineStarIcon } from "@/assets/Icons";

const CommentSection = ({ branchId }) => {
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        if (!branchId) return;
        const controller = new AbortController();
        fetchBranchReviews(branchId, setReviews, controller.signal);
        return () => controller.abort();
    }, [branchId]);

    const summary = useMemo(() => {
        if (!reviews?.length) return null;
        const dist = [0, 0, 0, 0, 0]; // index 0 = 1 star
        let sum = 0;
        reviews.forEach((r) => { sum += r.rating; dist[r.rating - 1] += 1; });
        return { avg: (sum / reviews.length).toFixed(1), dist, total: reviews.length };
    }, [reviews]);

    // Nothing to show while loading, and the whole section disappears when the
    // branch genuinely has no approved reviews yet.
    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="container md:py-20 py-12">
            <h2 className="md:text-2.5xl text-xl text-foreground font-semibold">نظرات مشتریان</h2>
            <p className="text-muted-fg text-super-sm mt-1.5 md:mb-8 mb-5">
                تجربهٔ کسانی که از این شعبه سفارش داده‌اند
            </p>

            <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
                {summary &&
                    <div className="bg-surface border border-border rounded-2xl shadow-soft p-6 text-center">
                        <div className="text-5xl font-extrabold leading-none tabular-nums">
                            {PersianNumber(summary.avg)}
                        </div>
                        <div className="flex items-center justify-center gap-0.5 mt-2.5 mb-1">
                            {[1, 2, 3, 4, 5].map((n) =>
                                n <= Math.round(summary.avg)
                                    ? <StarIcon key={n} className="w-5 h-5" />
                                    : <OutlineStarIcon key={n} className="w-5 h-5 opacity-40" />
                            )}
                        </div>
                        <p className="text-muted-fg text-super-xs">
                            از مجموع {PersianNumber(summary.total)} نظر تأییدشده
                        </p>

                        <div className="mt-5 pt-4 border-t border-border space-y-2">
                            {[5, 4, 3, 2, 1].map((n) => {
                                const count = summary.dist[n - 1];
                                const pct = summary.total ? (count / summary.total) * 100 : 0;
                                return (
                                    <div key={n} className="flex items-center gap-2.5 text-super-xs text-muted-fg">
                                        <span className="tabular-nums">{PersianNumber(n)}</span>
                                        <div className="flex-1 h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                                            <div className="h-full rounded-full bg-warning" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="tabular-nums">{PersianNumber(count)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }

                <div className="grid gap-3.5">
                    {(reviews || []).map((r) => (
                        <CommentCard key={r._id} text={r.text} rating={r.rating} user={r.user} menuItem={r.menuItem} createdAt={r.createdAt} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CommentSection;
