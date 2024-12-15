"use client";

import SelectBranchSection from "./SelectBranchSection";
import MenuSection from "./MenuSection";
import AboutBranchSection from "./AboutBranchSection";
import { useSearchParams } from "next/navigation";
import CommentSection from "./CommentSection";
import { useEffect, useState } from "react";



const BranchesPage = () => {
    const branch = useSearchParams().get("branch");
    const [menusItem, setMenusItem] = useState();

    const fetChBranchMenuItems = async (branchName) => {
        let branchId;
        if (branchName == "aghdasiyeh") branchId = "675de19cf836156025ee8575";
        else if (branchName == "tehranpars") branchId = "675de19cf836156025ee8575";
        else if (branchName == "tehranpars") branchId = "675de19cf836156025ee8575";
        else if (branchName == "tehranpars") branchId = "675de19cf836156025ee8575";
        else {
            return alert("this branch does not exist")
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/${branchId}`)
        const data = await res.json();
        console.log(data?.branch?.menus)
        setMenusItem(data?.branch?.menus);
    }

    useEffect(() => {
        if (branch) {
            fetChBranchMenuItems(branch);
        }
    }, [branch])
    

    return (
        <main>

            {/*//! Select Branch Section */}
            <SelectBranchSection branch={branch} />

            {branch ?
                <>
                    {/*//! Branch Foods Section */}
                    <MenuSection title="غذاهای شعبه اقدسیه" items={["1", "2", "3"]} />

                    {/*//! Popular Foods Section */}
                    <MenuSection title="غذاهای محبوب شعبه اقدسیه" items={["1", "2", "3"]} bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="پیش غذاهای شعبه اقدسیه" items={["1", "2", "3"]} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="پیش غذاهای محبوب شعبه اقدسیه" items={["1", "2", "3"]} bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="دسرهای شعبه اقدسیه" items={["1", "2", "3"]} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="دسرهای محبوب شعبه اقدسیه" items={["1", "2", "3"]} bgColor="green" />



                    {/*//! About Branch Section */}
                    <AboutBranchSection />


                    {/*//! User Comments Section */}
                    <CommentSection />
                </>
                :
                null
            }


        </main >
    );
}

export default BranchesPage;