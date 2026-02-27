"use client";

import useUserStore from "@/stores/useUserStore";

import { useEffect, useState } from "react";

const MenusSection = () => {
    const [items, setItems] = useState([]);

    const user = useUserStore((state) => state.user);



    useEffect(() => {
        console.log("user: ", user)
    }, [])
    const getBranchMenus = async () => {

    }

    return (
        <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 md:mt-10 mt-3.5">



        </article>
    );
}

export default MenusSection;