"use client";

import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import { toggleMenuAvailability } from "@/services/BranchManagerService";

const MenusSection = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const branch = useUserStore((state) => state.user?.branch);

    const getBranchMenus = async (signal) => {
        if (!branch) return;
        setLoading(true);
        try {
            const res = await api.get(`/branch-manager/menus/${branch}?limit=100`, { signal });
            setItems(res.data.menus);
        } catch (err) {
            if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();
        getBranchMenus(controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch]);

    const handleToggle = (menuId, available) =>
        toggleMenuAvailability(branch, menuId, available, () => getBranchMenus());

    return (
        <article className="grid lg:grid-cols-2 xl:gap-8 lg:gap-3.5 gap-6 md:mt-10 mt-3.5">
            {!loading && items.length === 0 && (
                <p className="text-muted-fg text-super-sm col-span-full">آیتم منویی یافت نشد.</p>
            )}

            {items.map((menu) => (
                <MenuCard key={menu._id} {...menu} onToggle={handleToggle} />
            ))}
        </article>
    );
};

export default MenusSection;
