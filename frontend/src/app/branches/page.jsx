"use client";

import SelectBranchSection from "./SelectBranchSection";
import MenuSection from "./MenuSection";
import AboutBranchSection from "./AboutBranchSection";
import { useSearchParams } from "next/navigation";
import CommentSection from "./CommentSection";
import { useEffect, useState } from "react";



const BranchesPage = () => {
    const branch = useSearchParams().get("branch");
    const [branchId, setBranchId] = useState(null);
    const [menusItem, setMenusItem] = useState();

    const fetChBranchMenuItems = async (branchName) => {
        // let branchId;
        // if (branchName == "aghdasiyeh") branchId = "675de19cf836156025ee8575";
        // else if (branchName == "tehranpars") branchId = "675f4c1655060567771c7884";
        // else if (branchName == "vanak") branchId = "675f4bfe55060567771c7881";
        // else if (branchName == "chalous") branchId = "675f4c3155060567771c7887";
        // else {
        //     return alert("this branch does not exist")
        // }
        console.log(branchId)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/${branchId}`)
        const data = await res.json();
        console.log(data?.branch?.menus)
        setMenusItem(data?.branch?.menus);
    }



    useEffect(() => {
        if (branch) {
            if (branch == "aghdasiyeh") setBranchId("675de19cf836156025ee8575");
            else if (branch == "tehranpars") setBranchId("675f4c1655060567771c7884");
            else if (branch == "vanak") setBranchId("675f4bfe55060567771c7881");
            else if (branch == "chalous") setBranchId("675f4c3155060567771c7887");
            fetChBranchMenuItems()
        }
    }, [branch])


    return (
        <main>

            {/*//! Select Branch Section */}
            <SelectBranchSection branch={branch} />

            {branch ?
                <>
                    {/*//! Branch Foods Section */}
                    <MenuSection title="غذاهای" branchId={branchId} category={"main"} />

                    {/*//! Popular Foods Section */}
                    <MenuSection title="غذاهای محبوب" branchId={branchId} category={"main"} ratingSort bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="پیش غذاهای" branchId={branchId} category={"side"} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="پیش غذاهای محبوب" branchId={branchId} category={"side"} ratingSort bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="دسرهای" branchId={branchId} category={"dessert"} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="دسرهای محبوب" branchId={branchId} category={"dessert"} ratingSort bgColor="green" />



                    {/*//! Branch Appetizers Section */}
                    <MenuSection title="نوشیدنی های" branchId={branchId} category={"drink"} />

                    {/*//! Popular Appetizers Section */}
                    <MenuSection title="نوشیدنی های محبوب" branchId={branchId} category={"drink"} ratingSort bgColor="green" />



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