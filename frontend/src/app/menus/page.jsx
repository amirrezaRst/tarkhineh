import { fetchBranchForMetadata } from "@/utils/branchMetadata";
import MenuPageClient from "./MenuPageClient";

export async function generateMetadata({ searchParams }) {
    const { branch: branchParam } = await searchParams;
    const branch = await fetchBranchForMetadata(branchParam);

    if (!branch) {
        return {
            title: "منوی رستوران‌ها",
            description: "منوی غذاهای شعبه‌های رستوران زنجیره‌ای ترخینه را مرور و سفارش دهید.",
        };
    }

    return {
        title: `منوی ${branch.name}`,
        description: `منوی کامل غذاهای شعبه ${branch.name} ترخینه؛ جستجو و فیلتر بر اساس دسته‌بندی.`,
    };
}

export default function MenuPage() {
    return <MenuPageClient />;
}
