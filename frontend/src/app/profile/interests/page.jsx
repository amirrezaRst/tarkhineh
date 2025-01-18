"use client";

import CategoryList from "./CategoryList";
import { useSearchParams } from "next/navigation";
import SearchBox from "./SearchBox";
import InterestList from "./InterestList";
import useUserStore from "@/stores/useUserStore";

const InterestsPage = () => {
    const category = useSearchParams().get("category") || "all";
    const user = useUserStore(state => state.user);

    return (
        <>

            {/*//! Searchbox section */}
            <div className="flex xl:flex-row flex-col-reverse items-center justify-between xl:gap-7 gap-4">

                <CategoryList category={category} />
                <SearchBox />

            </div>

            <InterestList userId={user?._id} category={category} />

        </>
    );
}

export default InterestsPage;