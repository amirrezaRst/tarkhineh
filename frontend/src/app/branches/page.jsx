"use client";

import SelectBranchSection from "./SelectBranchSection";
import MenuSection from "./MenuSection";
import AboutBranchSection from "./AboutBranchSection";
import { useSearchParams } from "next/navigation";
import CommentSection from "./CommentSection";
import useBranch from "@/hooks/useBranch";



const BranchesPage = () => {
    const branch = useSearchParams().get("branch");
    const { branchId, branch: info, status } = useBranch(branch);


    return (
        <main>

            {/*//! Select Branch Section */}
            <SelectBranchSection branch={branch} href={"branches"} />

            {branch && status === "not-found" &&
                <p className="container text-center text-muted-fg py-16">
                    شعبه‌ای با این مشخصات پیدا نشد.
                </p>
            }

            {branchId && info ?
                <>
                    {/*//! Branch Foods Section */}
                    <MenuSection title="غذاهای" branchId={branchId} branchName={info.name} category={"main"} />

                    {/*//! Popular Foods Section */}
                    <MenuSection title="غذاهای محبوب" branchId={branchId} branchName={info.name} category={"main"} ratingSort bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="پیش غذاهای" branchId={branchId} branchName={info.name} category={"side"} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="پیش غذاهای محبوب" branchId={branchId} branchName={info.name} category={"side"} ratingSort bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="دسرهای" branchId={branchId} branchName={info.name} category={"dessert"} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="دسرهای محبوب" branchId={branchId} branchName={info.name} category={"dessert"} ratingSort bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="نوشیدنی های" branchId={branchId} branchName={info.name} category={"drink"} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="نوشیدنی های محبوب" branchId={branchId} branchName={info.name} category={"drink"} ratingSort bgColor="green" />



                    {/*//! About Branch Section */}
                    <AboutBranchSection info={info} />


                    {/*//! User Comments Section */}
                    <CommentSection branchId={branchId} />
                </>
                :
                null
            }


        </main >
    );
}

export default BranchesPage;
