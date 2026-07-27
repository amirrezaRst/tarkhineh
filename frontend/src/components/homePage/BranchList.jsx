"use client";

import { useEffect, useState } from "react";
import BranchCard from './BranchCard';
import { branchList } from "@/constant/branchList";
import { api } from "@/utils/apiClient";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
const dbImages = (b) => (b.images || []).map((f) => `${IMAGE_URL}/branches/${f}`);

// The "ترخینه گردی" list is driven by the database so branches (and their
// images/address) an admin creates or edits show up for customers. The static
// branchList still provides routing slugs + map links for the seeded branches.
const BranchList = () => {
    const [db, setDb] = useState(null);

    useEffect(() => {
        const c = new AbortController();
        api.get("/branch", { signal: c.signal })
            .then((r) => setDb(r.branches || []))
            .catch(() => setDb([]));
        return () => c.abort();
    }, []);

    const byId = Object.fromEntries((db || []).map((b) => [String(b._id), b]));

    // seeded branches: overlay DB name/address/images onto the constant
    const items = branchList.map((c) => {
        const b = byId[c.id];
        return {
            key: c.id,
            name: b?.name || c.name,
            address: b?.address || c.address,
            images: b?.images?.length ? dbImages(b) : c.images.map((f) => `/images/${f}`),
            path: c.path,
        };
    });
    // branches created from the admin panel (not in the constant) — appended
    (db || []).forEach((b) => {
        if (!branchList.find((c) => c.id === String(b._id))) {
            items.push({ key: String(b._id), name: b.name, address: b.address || "", images: dbImages(b), path: String(b._id) });
        }
    });

    return (
        <section className="container lg:py-20 pt-12 pb-20">
            <h4 className="md:text-3xl text-2.5xl font-semibold text-center">ترخینه گردی</h4>
            <div className="grid xl:grid-cols-4 md:grid-cols-2 xl:gap-7 md:gap-10 gap-5 md:mt-11 mt-7">
                {items.map((it) => (
                    <BranchCard key={it.key} images={it.images} name={it.name} address={it.address} path={it.path} />
                ))}
            </div>
        </section>
    );
};

export default BranchList;
