"use client";

import BranchCard from "@/components/branchesPage/BranchCard";
import useBranches from "@/hooks/useBranches";

const SelectBranchSection = ({ branch, href }) => {
    const branches = useBranches();

    return (
        <section
            className={`container duration-200 ${branch ? "opacity-0 invisible scale-95 max-h-0" : "md:py-20 py-12 opacity-100 visible scale-100 max-h-full"}`}
        >

            <h2 className="md:text-3xl text-1.5xl font-semibold text-center">انتخاب شعبه</h2>

            {/* //! Branches List */}
            <div className="grid xl:grid-cols-4 md:grid-cols-2 xl:gap-7 md:gap-10 gap-5 md:mt-11 mt-5">
                {(branches || []).map((b) => (
                    <BranchCard key={b.id} imageSrc={b.images[0]} name={b.name} address={b.address} href={href} path={b.id} isOpen={b.isOpen} />
                ))}
            </div>

        </section>
    );
}

export default SelectBranchSection;
