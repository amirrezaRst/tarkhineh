"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { Avatar, RolePill, ROLE_META, faDate } from "../adminUtils";
import { deleteUser } from "@/services/AdminService";
import { SwapIcon, TrashIcon } from "../icons";
import RoleModal from "./RoleModal";

const TABS = [
    { key: "all", label: "همه" },
    { key: "admin", label: "مدیر کل" },
    { key: "branch_manager", label: "مدیر شعبه" },
    { key: "courier", label: "پیک" },
    { key: "user", label: "کاربر" },
];

const AdminUsers = () => {
    const [role, setRole] = useState("all");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

    const load = useCallback(async (signal) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/users?role=${role}&q=${encodeURIComponent(q)}&page=${page}`, { signal });
            setData(res.data);
        } catch (err) { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [role, q, page]);

    useEffect(() => {
        const c = new AbortController();
        const t = setTimeout(() => load(c.signal), 250);
        return () => { clearTimeout(t); c.abort(); };
    }, [load]);

    const reload = () => load();
    const counts = data?.roleCounts || {};
    const users = data?.users || [];

    const onDelete = async (u) => {
        if (!confirm(`کاربر «${u.fullName || u.phoneNumber}» حذف شود؟`)) return;
        await deleteUser(u._id, reload);
    };

    return (
        <div className="w-full">
            <PanelPageHeader title="کاربران و نقش‌ها" subtitle="مدیریت نقش‌ها، انتساب کاربران به شعبه و حذف حساب" />

            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-surface-sunken border border-border rounded-xl px-3.5 py-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted-fg shrink-0"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" /><path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    <input value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="جستجو با نام یا شماره…"
                        className="bg-transparent text-super-sm w-full focus:outline-none" />
                </div>
                <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1 flex-wrap">
                    {TABS.map((t) => (
                        <button key={t.key} onClick={() => { setPage(1); setRole(t.key); }}
                            className={`text-super-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${role === t.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>
                            {t.label}<span className="mr-1.5 tabular-nums opacity-70">{PersianNumber(counts[t.key] ?? 0)}</span>
                        </button>
                    ))}
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-super-sm">
                        <thead>
                            <tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">کاربر</th><th className="px-4 py-3 font-bold">شماره موبایل</th>
                                <th className="px-4 py-3 font-bold">نقش</th><th className="px-4 py-3 font-bold">شعبه</th>
                                <th className="px-4 py-3 font-bold">عضویت</th><th className="px-4 py-3 font-bold">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [0, 1, 2, 3, 4].map((i) => <tr key={i} className="border-t border-border"><td className="px-4 py-3" colSpan={6}><Skeleton className="h-8" /></td></tr>)
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-muted-fg">کاربری یافت نشد.</td></tr>
                            ) : users.map((u) => (
                                <tr key={u._id} className="border-t border-border hover:bg-surface-sunken/50">
                                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={u.fullName} phone={u.phoneNumber} role={u.role} size={32} /><span className="font-semibold">{u.fullName || "بدون نام"}</span></div></td>
                                    <td className="px-4 py-3 tabular-nums text-muted-fg">{u.phoneNumber}</td>
                                    <td className="px-4 py-3"><RolePill role={u.role} /></td>
                                    <td className="px-4 py-3">{u.branch?.name || <span className="text-subtle-fg">—</span>}</td>
                                    <td className="px-4 py-3 tabular-nums text-muted-fg">{faDate(u.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditing(u)} aria-label="تغییر نقش" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-primary hover:border-primary/40" title="تغییر نقش"><SwapIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDelete(u)} aria-label="حذف" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40" title="حذف"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data && data.pages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border text-super-xs">
                        <span className="text-muted-fg">صفحهٔ {PersianNumber(data.page)} از {PersianNumber(data.pages)} · {PersianNumber(data.total)} کاربر</span>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-border font-bold disabled:opacity-40">قبلی</button>
                            <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-border font-bold disabled:opacity-40">بعدی</button>
                        </div>
                    </div>
                )}
            </Card>

            <RoleModal open={!!editing} onClose={() => setEditing(null)} user={editing} onSaved={reload} />
        </div>
    );
};

export default AdminUsers;
