import { fetchBranchForMetadata } from "@/utils/branchMetadata";
import BranchesPageClient from "./BranchesPageClient";

export async function generateMetadata({ searchParams }) {
    const { branch: branchParam } = await searchParams;
    const branch = await fetchBranchForMetadata(branchParam);

    if (!branch) {
        return {
            title: "شعبه‌های ترخینه",
            description: "همه‌ی شعبه‌های رستوران زنجیره‌ای ترخینه را ببینید؛ آدرس، ساعات کاری و منوی هر شعبه.",
        };
    }

    return {
        title: branch.name,
        description: `آدرس، ساعات کاری و منوی شعبه ${branch.name} ترخینه.${branch.address ? ` آدرس: ${branch.address}.` : ""}`,
    };
}

export default function BranchesPage() {
    return <BranchesPageClient />;
}
