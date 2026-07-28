"use client";

import { useEffect, useState } from "react";
import CommentCard from "@/components/branchesPage/CommentCard";
import { fetchBranchReviews } from "@/services/MenuService";

const CommentSection = ({ branchId }) => {
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        if (!branchId) return;
        const controller = new AbortController();
        fetchBranchReviews(branchId, setReviews, controller.signal);
        return () => controller.abort();
    }, [branchId]);

    if (reviews && reviews.length === 0) return null;

    return (
        <section
            className={`md:container md:py-20 py-12 mt-10 mb-5`}
        >
            <h2 className="md:text-3xl text-1.5xl font-semibold text-center md:mb-8 mb-5">نظرات کاربران</h2>

            {/*//! Comments List */}
            <div className="flex md:gap-8 gap-5 overflow-x-auto pb-2">
                {(reviews || []).map((r) => (
                    <CommentCard key={r._id} text={r.text} rating={r.rating} user={r.user} menuItem={r.menuItem} createdAt={r.createdAt} />
                ))}
            </div>

        </section>
    );
}

export default CommentSection;
