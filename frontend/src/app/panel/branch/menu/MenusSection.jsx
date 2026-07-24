"use client";

import { useEffect, useMemo, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import { toggleMenuAvailability } from "@/services/BranchManagerService";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import MetricBar from "@/components/panel/MetricBar";
import { SkeletonMenuCard } from "@/components/panel/Skeleton";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import MenuCard from "./MenuCard";

// Menu categories (Menu.category enum) → Persian labels for the filter chips.
const CATEGORIES = [
    { key: "all", label: "همه" },
    { key: "main", label: "غذای اصلی" },
    { key: "side", label: "پیش‌غذا" },
    { key: "dessert", label: "دسر" },
    { key: "drink", label: "نوشیدنی" },
];

const MenusSection = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";

    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(true);

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

    const stats = useMemo(() => {
        const total = items.length;
        const active = items.filter((m) => m.available).length;
        const cats = new Set(items.map((m) => m.category)).size;
        return { total, active, inactive: total - active, cats };
    }, [items]);

    const filtered = useMemo(
        () => (category === "all" ? items : items.filter((m) => m.category === category)),
        [items, category]
    );

    return (
        <div className="max-w-[1240px]">
            <PanelPageHeader title="منوی شعبه" subtitle={`مدیریت آیتم‌های موجود در شعبه ${branchName}`} />

            <div className="mb-5">
                <MetricBar items={[
                    { value: PersianNumber(stats.total), label: "کل آیتم‌های منو" },
                    { value: PersianNumber(stats.active), label: "فعال در شعبه" },
                    { value: PersianNumber(stats.inactive), label: "غیرفعال در شعبه" },
                    { value: PersianNumber(stats.cats), label: "دسته‌بندی‌ها" },
                ]} />
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-5">
                {CATEGORIES.map((c) => {
                    const on = category === c.key;
                    return (
                        <button key={c.key} onClick={() => setCategory(c.key)}
                            className={`rounded-xl px-3.5 py-2 text-super-sm font-bold border transition-colors ${on ? "bg-primary text-primary-fg border-primary" : "bg-surface text-muted-fg border-border hover:border-border-strong"}`}>
                            {c.label}
                        </button>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-3.5">
                {loading ? (
                    <><SkeletonMenuCard /><SkeletonMenuCard /><SkeletonMenuCard /><SkeletonMenuCard /></>
                ) : filtered.length === 0 ? (
                    <p className="text-muted-fg text-super-sm col-span-full py-6 text-center">آیتمی در این دسته یافت نشد.</p>
                ) : (
                    filtered.map((menu) => <MenuCard key={menu._id} {...menu} onToggle={handleToggle} />)
                )}
            </div>
        </div>
    );
};

export default MenusSection;
