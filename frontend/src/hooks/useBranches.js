"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { branchList as staticBranchList } from "@/constant/branchList";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
const faTime = (t) => (t ? PersianNumber(t) : null);

// Live branch list for every public "pick a branch" surface (homepage,
// /branches picker, contact-us, navbar/footer links). Any branch created in
// the admin panel shows up here automatically; the 4 originally-seeded
// branches still fall back to the static constant for whichever profile
// fields (address/images/map) haven't been filled in via the admin panel yet.
const useBranches = () => {
    const [branches, setBranches] = useState(null); // null = loading

    useEffect(() => {
        const controller = new AbortController();
        api.get("/branch", { signal: controller.signal })
            .then((res) => {
                const list = (res.branches || []).map((b) => {
                    const fallback = staticBranchList.find((f) => f.id === String(b._id));
                    const hoursLabel = b.openTime && b.closeTime
                        ? `همه‌روزه از ساعت ${faTime(b.openTime)} تا ${faTime(b.closeTime)}`
                        : (fallback ? "همه‌روزه از ساعت ۱۲ تا ۲۳" : "ساعات کاری ثبت نشده است");
                    return {
                        id: String(b._id),
                        name: b.name,
                        address: b.address || fallback?.address || "",
                        phone: b.phoneNumber || fallback?.phone || "",
                        hoursLabel,
                        images: b.images?.length
                            ? b.images.map((f) => `${IMAGE_URL}/branches/${f}`)
                            : fallback?.images?.length
                                ? fallback.images.map((f) => `/images/${f}`)
                                : ["/images/restaurant-image-1.jpg"],
                        isOpen: b.isOpen,
                        map: fallback?.map || null,
                    };
                });
                setBranches(list);
            })
            .catch((err) => { if (err.name !== "AbortError") setBranches([]); });
        return () => controller.abort();
    }, []);

    return branches;
};

export default useBranches;
