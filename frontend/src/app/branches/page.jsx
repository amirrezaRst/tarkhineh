"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import SelectBranchSection from "./SelectBranchSection";
import BranchHero from "./BranchHero";
import PopularRail from "./PopularRail";
import BranchMenu from "./BranchMenu";
import CommentSection from "./CommentSection";
import useBranch from "@/hooks/useBranch";
import { fetchAllBranchItems } from "@/services/MenuService";
import { Skeleton } from "@/components/panel/Skeleton";

const BranchesPage = () => {
    const branch = useSearchParams().get("branch");
    const { branchId, branch: info, status } = useBranch(branch);
    const [items, setItems] = useState(null);

    // One request for the whole branch: the tabs' counts, the menu grid and the
    // top-rated rail are all derived from this payload on the client.
    useEffect(() => {
        if (!branchId) { setItems(null); return; }
        const controller = new AbortController();
        fetchAllBranchItems(branchId, setItems, controller.signal);
        return () => controller.abort();
    }, [branchId]);

    const topRated = useMemo(() => {
        if (!items) return [];
        return [...items]
            .filter((i) => i.available !== false && i.reviews?.averageRating)
            .sort((a, b) => b.reviews.averageRating - a.reviews.averageRating)
            .slice(0, 8);
    }, [items]);

    return (
        <main>

            {/*//! Select Branch Section */}
            <SelectBranchSection branch={branch} href={"branches"} />

            {branch && status === "not-found" &&
                <p className="container text-center text-muted-fg py-16">
                    شعبه‌ای با این مشخصات پیدا نشد.
                </p>
            }

            {branchId && status === "loading" && <HeroSkeleton />}

            {branchId && info &&
                <>
                    <BranchHero info={info} />

                    {items === null
                        ? <MenuSkeleton />
                        : <>
                            {/* keyed per branch so switching branches resets the
                                active tab and the rail's scroll position */}
                            <PopularRail key={`rail-${branchId}`} items={topRated} branchId={branchId} branchName={info.name} />
                            <BranchMenu key={`menu-${branchId}`} items={items} branchId={branchId} branchName={info.name} />
                        </>
                    }

                    <CommentSection branchId={branchId} />
                </>
            }

        </main>
    );
}

const HeroSkeleton = () => (
    <>
        <Skeleton className="w-full md:h-[440px] h-[340px] rounded-none" />
        <div className="container">
            <Skeleton className="relative z-[2] -mt-16 h-[116px] rounded-2xl" />
        </div>
    </>
);

const MenuSkeleton = () => (
    <div className="container md:pt-16 pt-12">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-8">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[330px] rounded-2xl" />)}
        </div>
    </div>
);

export default BranchesPage;
