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
import { Avatar, branchImg } from "../adminUtils";
import { PlusIcon, PinIcon, ClockIcon, ImageIcon } from "../icons";
import BranchFormModal from "./BranchFormModal";

const OpenTag = ({ isOpen }) => {
    if (isOpen === null || isOpen === undefined) return <span className="text-super-xs font-bold px-2.5 py-1 rounded-full bg-white/85 text-muted-fg backdrop-blur">ساعت ثبت‌نشده</span>;
    return isOpen
        ? <span className="inline-flex items-center gap-1.5 text-super-xs font-bold px-2.5 py-1 rounded-full bg-status-delivered-subtle text-status-delivered"><span className="w-1.5 h-1.5 rounded-full bg-current" /> باز</span>
        : <span className="inline-flex items-center gap-1.5 text-super-xs font-bold px-2.5 py-1 rounded-full bg-status-cancelled-subtle text-status-cancelled"><span className="w-1.5 h-1.5 rounded-full bg-current" /> بسته</span>;
};

const BranchCard = ({ b, onOpen }) => {
    const img = branchImg(b.images);
    return (
        <Card interactive className="overflow-hidden cursor-pointer flex flex-col" onClick={() => onOpen(b)}>
            {/* cover */}
            <div className="relative h-36 bg-surface-sunken">
                {img ? <img src={img} alt={b.name} className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full grid place-items-center text-subtle-fg"><ImageIcon className="w-8 h-8" /></div>
                )}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
                    <OpenTag isOpen={b.isOpen} />
                    {!b.manager && <span className="text-super-xs font-bold px-2.5 py-1 rounded-full bg-warning-subtle text-warning-fg">بدون مدیر</span>}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-super-base font-extrabold">{b.name}</h3>

                {b.address && <p className="flex items-start gap-1.5 text-super-xs text-muted-fg mt-1.5 leading-6"><PinIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span className="line-clamp-2">{b.address}</span></p>}
                {b.openTime && b.closeTime && <p className="flex items-center gap-1.5 text-super-xs text-subtle-fg mt-1 tabular-nums"><ClockIcon className="w-3.5 h-3.5 shrink-0" />{b.openTime} تا {b.closeTime}</p>}

                <div className="flex gap-4 mt-3.5 pt-3.5 border-t border-border">
                    <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(b.orders)}</div><div className="text-super-xs text-muted-fg">سفارش ماه</div></div>
                    <div><div className="text-super-base font-extrabold tabular-nums">{FormatPrice(b.revenue)}</div><div className="text-super-xs text-muted-fg">درآمد</div></div>
                    <div><div className="text-super-base font-extrabold tabular-nums">{PersianNumber(b.couriers)}</div><div className="text-super-xs text-muted-fg">پیک</div></div>
                </div>

                <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-border">
                    {b.manager ? (
                        <><Avatar name={b.manager.fullName} phone={b.manager.phoneNumber} role="branch_manager" size={28} />
                            <span className="text-super-xs font-semibold truncate">{b.manager.fullName || b.manager.phoneNumber}</span>
                            <span className="text-super-xs text-subtle-fg mr-auto">مدیر شعبه</span></>
                    ) : <span className="text-super-xs text-warning-fg">مدیری منتسب نشده است</span>}
                </div>
            </div>
        </Card>
    );
};

const AdminBranches = () => {
    const router = useRouter();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newModal, setNewModal] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await api.get("/admin/branches");
            setBranches(res.data.branches);
        } catch { toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);

    return (
        <div className="w-full">
            <PanelPageHeader title="مدیریت شعبه‌ها" subtitle="برای ویرایش یا حذف یک شعبه، ابتدا روی کارت آن کلیک کنید — تصاویر و مشخصات روی سایت مشتری نمایش داده می‌شود"
                action={<button onClick={() => setNewModal(true)} className="inline-flex items-center gap-2 bg-primary text-primary-fg rounded-xl px-4 py-2.5 text-super-sm font-bold hover:bg-primary-hover"><PlusIcon className="w-4 h-4" /> شعبهٔ جدید</button>} />

            {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}</div>
            ) : branches.length === 0 ? (
                <Card className="p-12 text-center text-muted-fg text-super-sm">هنوز شعبه‌ای ثبت نشده است.</Card>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {branches.map((b) => <BranchCard key={b._id} b={b} onOpen={(br) => router.push(`/admin/branches/${br._id}`)} />)}
                </div>
            )}

            <BranchFormModal open={newModal} onClose={() => setNewModal(false)} onSaved={load} />
        </div>
    );
};

export default AdminBranches;
