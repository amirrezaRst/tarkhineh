"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { Avatar, RolePill } from "../adminUtils";
import { deleteBranch } from "@/services/AdminService";
import BranchFormModal from "./BranchFormModal";

const BranchCard = ({ b, onOpen, onEdit, onDelete }) => (
    <Card interactive className="p-5 cursor-pointer" onClick={() => onOpen(b)}>
        <div className="flex items-start justify-between gap-3">
            <div>
                <div className="text-super-base font-extrabold">{b.name}</div>
                <div className="text-super-xs text-muted-fg mt-0.5">ظرفیت هر پیک: {PersianNumber(b.courierCapacity)} · رضایت {b.avgRating != null ? PersianNumber(b.avgRating) : "—"}</div>
            </div>
            {b.manager ? <RolePill role="branch_manager">فعال</RolePill> : <RolePill tone="warn">بدون مدیر</RolePill>}
        </div>

        <div className="flex gap-6 my-4 py-4 border-y border-border">
            <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(b.orders)}</div><div className="text-super-xs text-muted-fg">سفارش ماه</div></div>
            <div><div className="text-super-base font-extrabold tabular-nums">{FormatPrice(b.revenue)}</div><div className="text-super-xs text-muted-fg">درآمد (ت)</div></div>
            <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(b.couriers)}</div><div className="text-super-xs text-muted-fg">پیک</div></div>
        </div>

        <div className="flex items-center justify-between gap-3">
            {b.manager ? (
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={b.manager.fullName} phone={b.manager.phoneNumber} role="branch_manager" size={32} />
                    <div className="min-w-0">
                        <div className="text-super-sm font-bold truncate">{b.manager.fullName || "بدون نام"}</div>
                        <div className="text-super-xs text-muted-fg tabular-nums">{b.manager.phoneNumber}</div>
                    </div>
                </div>
            ) : <span className="text-super-xs text-warning-fg">مدیری منتسب نشده است</span>}
            <div className="flex gap-2 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onEdit(b); }} aria-label="ویرایش" className="w-9 h-9 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-foreground hover:border-border-strong">✎</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(b); }} aria-label="حذف" className="w-9 h-9 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40">🗑</button>
            </div>
        </div>
    </Card>
);

const AdminBranches = () => {
    const router = useRouter();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // {mode:'new'|'edit', branch?}

    const load = useCallback(async () => {
        try {
            const res = await api.get("/admin/branches");
            setBranches(res.data.branches);
        } catch { toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onDelete = async (b) => {
        if (!confirm(`شعبهٔ «${b.name}» حذف شود؟`)) return;
        await deleteBranch(b._id, load);
    };

    return (
        <div className="w-full">
            <PanelPageHeader title="مدیریت شعبه‌ها" subtitle="ایجاد و ویرایش شعبه‌ها، انتساب مدیر و ظرفیت پیک"
                action={<button onClick={() => setModal({ mode: "new" })} className="bg-primary text-primary-fg rounded-xl px-4 py-2.5 text-super-sm font-bold hover:bg-primary-hover">＋ شعبهٔ جدید</button>} />

            {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}</div>
            ) : branches.length === 0 ? (
                <Card className="p-12 text-center text-muted-fg text-super-sm">هنوز شعبه‌ای ثبت نشده است.</Card>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {branches.map((b) => <BranchCard key={b._id} b={b} onOpen={(br) => router.push(`/admin/branches/${br._id}`)} onEdit={(br) => setModal({ mode: "edit", branch: br })} onDelete={onDelete} />)}
                </div>
            )}

            <BranchFormModal open={!!modal} onClose={() => setModal(null)} branch={modal?.branch} onSaved={load} />
        </div>
    );
};

export default AdminBranches;
