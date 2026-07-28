import { branchList } from "@/constant/branchList";

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

// Every branch is addressed by its Mongo _id now. Old bookmarked/shared links
// still use the legacy slugs ("vanak", "chalous", ...) from the 4 seeded
// branches, so those are resolved through the static list for backward
// compatibility; anything else is assumed to already be an id.
export const resolveBranchId = (param) => {
    if (!param) return null;
    if (OBJECT_ID_RE.test(param)) return param;
    return branchList.find((b) => b.path === param)?.id || null;
};
