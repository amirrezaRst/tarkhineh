"use client";

import BranchCard from './BranchCard';
import useBranches from "@/hooks/useBranches";
import { SkeletonBranchCard } from "@/components/Skeleton";

// The "ترخینه گردی" list is fully DB-driven via useBranches, so any branch
// created or edited in the admin panel shows up here automatically.
const BranchList = () => {
    const branches = useBranches();

    return (
        <section className="container lg:py-20 pt-12 pb-20">
            <h4 className="md:text-3xl text-2.5xl font-semibold text-center">ترخینه گردی</h4>
            <div className="grid xl:grid-cols-4 md:grid-cols-2 xl:gap-7 md:gap-10 gap-5 md:mt-11 mt-7">
                {branches === null
                    ? [0, 1, 2, 3].map((i) => <SkeletonBranchCard key={i} />)
                    : branches.map((b) => (
                        <BranchCard key={b.id} images={b.images} name={b.name} address={b.address} path={b.id} isOpen={b.isOpen} />
                    ))
                }
            </div>
        </section>
    );
};

export default BranchList;
