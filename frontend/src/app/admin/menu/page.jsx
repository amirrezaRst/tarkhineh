"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { SkeletonMenuCard } from "@/components/Skeleton";
import { CAT_LABEL, menuImg } from "../adminUtils";
import { deleteMenuItem } from "@/services/AdminService";
import { EditIcon, TrashIcon, PlusIcon } from "../icons";
import MenuFormModal from "./MenuFormModal";

const TABS = [{ key: "all", label: "همه" }, { key: "main", label: "غذای اصلی" }, { key: "side", label: "پیش‌غذا" }, { key: "drink", label: "نوشیدنی" }, { key: "dessert", label: "دسر" }];

const MenuCard = ({ m, onEdit, onDelete }) => {
    const img = menuImg(m.images);
    return (
        <Card className="overflow-hidden flex flex-col">
            <div className="h-28 relative bg-gradient-to-br from-[hsl(var(--brand-200))] to-[hsl(var(--brand-500))]">
                {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                <span className="absolute top-2 right-2 bg-black/40 text-white text-super-xs font-bold px-2 py-0.5 rounded-full">{CAT_LABEL[m.category] || m.category}</span>
                {!m.available && <span className="absolute top-2 left-2 bg-destructive text-white text-super-xs font-bold px-2 py-0.5 rounded-full">ناموجود</span>}
            </div>
            <div className="p-3.5 flex-1 flex flex-col gap-1.5">
                <div className="font-extrabold text-super-sm">{m.name}</div>
                <div className="text-super-xs text-muted-fg line-clamp-2 leading-6">{m.description}</div>
                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-extrabold text-primary tabular-nums text-super-sm">{FormatPrice(m.price)} ت</span>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(m)} aria-label="ویرایش" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-foreground hover:border-border-strong"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(m)} aria-label="حذف" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const AdminMenu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState("all");
    const [q, setQ] = useState("");
    const [modal, setModal] = useState(null); // {mode, item?}

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/menu");
            setItems(res.menuItems || []);
        } catch { toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = useMemo(() => {
        const rx = q.trim() ? new RegExp(q.trim(), "i") : null;
        return items.filter((m) => (cat === "all" || m.category === cat) && (!rx || rx.test(m.name)));
    }, [items, cat, q]);

    const onDelete = async (m) => {
        if (!confirm(`«${m.name}» از کاتالوگ حذف شود؟`)) return;
        await deleteMenuItem(m._id, load);
    };

    return (
        <div className="w-full">
            <PanelPageHeader title="منوی کاتالوگ" subtitle="کاتالوگ سراسری غذاها؛ شعبه‌ها از این فهرست انتخاب می‌کنند"
                action={<button onClick={() => setModal({ mode: "new" })} className="inline-flex items-center gap-2 bg-primary text-primary-fg rounded-xl px-4 py-2.5 text-super-sm font-bold hover:bg-primary-hover"><PlusIcon className="w-4 h-4" /> افزودن غذا</button>} />

            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-surface-sunken border border-border rounded-xl px-3.5 py-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted-fg shrink-0"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" /><path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی غذا…" className="bg-transparent text-super-sm w-full focus:outline-none" />
                </div>
                <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1 flex-wrap">
                    {TABS.map((t) => (
                        <button key={t.key} onClick={() => setCat(t.key)}
                            className={`text-super-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${cat === t.key ? "bg-surface text-primary shadow-sm" : "text-muted-fg hover:text-foreground"}`}>{t.label}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <SkeletonMenuCard key={i} />)}</div>
            ) : filtered.length === 0 ? (
                <Card className="p-12 text-center text-muted-fg text-super-sm">{q || cat !== "all" ? "آیتمی با این فیلتر یافت نشد." : "کاتالوگ خالی است."}</Card>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((m) => <MenuCard key={m._id} m={m} onEdit={(it) => setModal({ mode: "edit", item: it })} onDelete={onDelete} />)}
                </div>
            )}

            <MenuFormModal open={!!modal} onClose={() => setModal(null)} item={modal?.item} onSaved={load} />
        </div>
    );
};

export default AdminMenu;
