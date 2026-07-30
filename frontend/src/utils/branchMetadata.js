import { resolveBranchId } from "@/utils/resolveBranchId";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-side only, for generateMetadata — separate from useBranch's
// client-side fetch since metadata has to resolve before anything renders.
export const fetchBranchForMetadata = async (branchParam) => {
    const branchId = resolveBranchId(branchParam);
    if (!branchId) return null;
    try {
        const res = await fetch(`${API_URL}/branch/${branchId}`, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        const { branch } = await res.json();
        return branch;
    } catch {
        return null;
    }
};
