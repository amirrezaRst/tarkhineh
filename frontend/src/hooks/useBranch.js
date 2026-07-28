"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { branchList as staticBranchList } from "@/constant/branchList";
import { resolveBranchId } from "@/utils/resolveBranchId";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

const faTime = (t) => (t ? PersianNumber(t) : null);

// Resolves a "branch" URL param (legacy slug or Mongo id) to the branch's
// live profile from the backend, so every public page works for ANY branch —
// not just the 4 originally seeded ones. Falls back to the static constant
// for fields the admin hasn't filled in yet (only meaningful for the seeded
// 4, since new branches have no static counterpart).
const useBranch = (param) => {
    const branchId = resolveBranchId(param);
    const [branch, setBranch] = useState(null);
    const [status, setStatus] = useState(branchId ? "loading" : "idle");

    useEffect(() => {
        if (!branchId) { setBranch(null); setStatus("idle"); return; }
        setStatus("loading");
        const controller = new AbortController();
        api.get(`/branch/${branchId}`, { signal: controller.signal })
            .then((res) => {
                const b = res.branch;
                if (!b) { setStatus("not-found"); return; }
                const fallback = staticBranchList.find((f) => f.id === branchId);
                const hoursLabel = b.openTime && b.closeTime
                    ? `همه‌روزه از ساعت ${faTime(b.openTime)} تا ${faTime(b.closeTime)}`
                    : (fallback ? "همه‌روزه از ساعت ۱۲ تا ۲۳" : "ساعات کاری ثبت نشده است");
                setBranch({
                    _id: b._id,
                    name: b.name,
                    address: b.address || fallback?.address || "آدرس ثبت نشده است",
                    phone: b.phoneNumber || fallback?.phone || "—",
                    hoursLabel,
                    isOpen: b.isOpen,
                    images: b.images?.length
                        ? b.images.map((f) => `${IMAGE_URL}/branches/${f}`)
                        : fallback?.images?.length
                            ? fallback.images.map((f) => `/images/${f}`)
                            : ["/images/restaurant-image-1.jpg"],
                    map: fallback?.map || null,
                    largeMap: fallback?.largeMap || null,
                });
                setStatus("loaded");
            })
            .catch((err) => { if (err.name !== "AbortError") setStatus("not-found"); });
        return () => controller.abort();
    }, [branchId]);

    return { branchId, branch, status };
};

export default useBranch;
