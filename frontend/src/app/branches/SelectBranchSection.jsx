"use client";

import BranchCard from "@/components/branchesPage/BranchCard";
import { branchList } from "@/constant/branchList";

const SelectBranchSection = ({branch,href}) => {
    
    return (
        <section
            className={`container duration-200 ${branch ? "opacity-0 invisible scale-95 max-h-0" : "md:py-20 py-12 opacity-100 visible scale-100 max-h-full"}`}
        >

            <h2 className="md:text-3xl text-1.5xl font-semibold text-center">انتخاب شعبه</h2>

            {/* //! Branches List */}
            <div className="grid xl:grid-cols-4 md:grid-cols-2 xl:gap-7 md:gap-10 gap-5 md:mt-11 mt-5">
                {branchList.map(({ name, images, address, path }, index) => (
                    <BranchCard key={index} imageSrc={images[0]} name={name} address={address} href={href} path={path} />
                ))}
            </div>

        </section>
    );
}

export default SelectBranchSection;