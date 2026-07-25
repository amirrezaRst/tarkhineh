"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { Avatar } from "../adminUtils";

// Searchable picker of users eligible to manage a branch (role user or
// branch_manager). Debounced query against /admin/assignable-users.
const UserPicker = ({ value, onChange }) => {
    const [q, setQ] = useState("");
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const c = new AbortController();
        const t = setTimeout(() => {
            setLoading(true);
            api.get(`/admin/assignable-users?q=${encodeURIComponent(q)}`, { signal: c.signal })
                .then((res) => setList(res.data.users))
                .catch(() => { })
                .finally(() => setLoading(false));
        }, 250);
        return () => { clearTimeout(t); c.abort(); };
    }, [q]);

    if (value) {
        return (
            <div className="flex items-center justify-between gap-3 border border-border rounded-xl px-3 py-2.5 bg-surface-sunken">
                <div className="flex items-center gap-2.5">
                    <Avatar name={value.fullName} phone={value.phoneNumber} role={value.role} size={34} />
                    <div>
                        <div className="text-super-sm font-bold">{value.fullName || "بدون نام"}</div>
                        <div className="text-super-xs text-muted-fg tabular-nums">{value.phoneNumber}</div>
                    </div>
                </div>
                <button type="button" onClick={() => onChange(null)} className="text-super-xs font-bold text-destructive px-2 py-1">تغییر</button>
            </div>
        );
    }

    return (
        <div className="relative">
            <input
                value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setOpen(true)}
                placeholder="جستجوی کاربر با نام یا شماره…"
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {open && (
                <div className="absolute z-10 mt-1.5 w-full max-h-60 overflow-y-auto bg-surface border border-border rounded-xl shadow-soft-lg p-1.5">
                    {loading && <div className="text-super-xs text-muted-fg text-center py-3">در حال جستجو…</div>}
                    {!loading && list.length === 0 && <div className="text-super-xs text-muted-fg text-center py-3">کاربری یافت نشد.</div>}
                    {list.map((u) => (
                        <button key={u._id} type="button" onClick={() => { onChange(u); setOpen(false); setQ(""); }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-sunken text-right">
                            <Avatar name={u.fullName} phone={u.phoneNumber} role={u.role} size={30} />
                            <div className="min-w-0">
                                <div className="text-super-sm font-semibold truncate">{u.fullName || "بدون نام"}</div>
                                <div className="text-super-xs text-muted-fg tabular-nums">{u.phoneNumber}{u.role === "branch_manager" ? " · مدیر شعبه" : ""}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPicker;
