"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/panel/Skeleton";
import { CAT_LABEL, faDate } from "../adminUtils";
import { deleteCoupon, deleteDiscount } from "@/services/AdminService";
import { EditIcon, TrashIcon, PlusIcon } from "../icons";
import CouponModal from "./CouponModal";
import DiscountModal from "./DiscountModal";

const val = (t, v) => (t === "percentage" ? `${PersianNumber(v)}٪` : `${FormatPrice(v)} ت`);
const isActive = (active, to) => active && new Date(to) >= new Date();

const AdminPromotions = () => {
    const [tab, setTab] = useState("coupons");
    const [coupons, setCoupons] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [couponModal, setCouponModal] = useState(null); // {coupon?}
    const [discountModal, setDiscountModal] = useState(null); // {discount?}

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [c, d] = await Promise.all([api.get("/admin/coupons"), api.get("/admin/discounts")]);
            setCoupons(c.data.coupons);
            setDiscounts(d.data.discounts);
            setMenus(d.data.menus);
        } catch { toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);

    const onDelCoupon = async (c) => { if (confirm(`کوپن ${c.code} حذف شود؟`)) await deleteCoupon(c._id, load); };
    const onDelDiscount = async (d) => { if (confirm("این تخفیف حذف شود؟")) await deleteDiscount(d._id, load); };

    return (
        <div className="w-full">
            <PanelPageHeader title="کوپن و تخفیف" subtitle="مدیریت کدهای تخفیف سراسری و تخفیف روی آیتم‌های منو"
                action={tab === "coupons"
                    ? <button onClick={() => setCouponModal({})} className="inline-flex items-center gap-2 bg-primary text-primary-fg rounded-xl px-4 py-2.5 text-super-sm font-bold hover:bg-primary-hover"><PlusIcon className="w-4 h-4" /> کوپن جدید</button>
                    : <button onClick={() => setDiscountModal({})} className="inline-flex items-center gap-2 bg-primary text-primary-fg rounded-xl px-4 py-2.5 text-super-sm font-bold hover:bg-primary-hover"><PlusIcon className="w-4 h-4" /> تخفیف جدید</button>} />

            <div className="inline-flex bg-surface-sunken border border-border rounded-xl p-1 gap-1 mb-5">
                <button onClick={() => setTab("coupons")} className={`text-super-sm font-bold px-4 py-1.5 rounded-lg transition-colors ${tab === "coupons" ? "bg-surface text-primary shadow-sm" : "text-muted-fg"}`}>کوپن‌ها<span className="mr-1.5 tabular-nums opacity-70">{PersianNumber(coupons.length)}</span></button>
                <button onClick={() => setTab("discounts")} className={`text-super-sm font-bold px-4 py-1.5 rounded-lg transition-colors ${tab === "discounts" ? "bg-surface text-primary shadow-sm" : "text-muted-fg"}`}>تخفیف آیتم‌ها<span className="mr-1.5 tabular-nums opacity-70">{PersianNumber(discounts.length)}</span></button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    {tab === "coupons" ? (
                        <table className="w-full text-super-sm">
                            <thead><tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">کد</th><th className="px-4 py-3 font-bold">تخفیف</th><th className="px-4 py-3 font-bold">حداقل سفارش</th>
                                <th className="px-4 py-3 font-bold">سقف دفعات</th><th className="px-4 py-3 font-bold">اعتبار</th><th className="px-4 py-3 font-bold">وضعیت</th><th className="px-4 py-3 font-bold"></th>
                            </tr></thead>
                            <tbody>
                                {loading ? [0, 1, 2].map((i) => <tr key={i} className="border-t border-border"><td colSpan={7} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                                    : coupons.length === 0 ? <tr><td colSpan={7} className="text-center py-10 text-muted-fg">کوپنی ثبت نشده است.</td></tr>
                                        : coupons.map((c) => (
                                            <tr key={c._id} className="border-t border-border hover:bg-surface-sunken/50">
                                                <td className="px-4 py-3 font-extrabold tracking-wider">{c.code}</td>
                                                <td className="px-4 py-3 font-bold tabular-nums">{val(c.discountType, c.discountValue)}</td>
                                                <td className="px-4 py-3 tabular-nums text-muted-fg">{c.minAmount ? `${FormatPrice(c.minAmount)} ت` : "—"}</td>
                                                <td className="px-4 py-3 tabular-nums">{PersianNumber(c.usageLimit)}</td>
                                                <td className="px-4 py-3 text-super-xs text-muted-fg tabular-nums">{faDate(c.validFrom)} تا {faDate(c.validTo)}</td>
                                                <td className="px-4 py-3">{isActive(c.active, c.validTo) ? <span className="text-super-xs font-bold bg-status-delivered-subtle text-status-delivered px-2.5 py-1 rounded-full">فعال</span> : <span className="text-super-xs font-bold bg-surface-sunken text-muted-fg px-2.5 py-1 rounded-full">غیرفعال</span>}</td>
                                                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => setCouponModal({ coupon: c })} aria-label="ویرایش" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-foreground"><EditIcon className="w-4 h-4" /></button><button onClick={() => onDelCoupon(c)} aria-label="حذف" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40"><TrashIcon className="w-4 h-4" /></button></div></td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-super-sm">
                            <thead><tr className="bg-surface-sunken text-super-xs font-bold text-muted-fg text-right">
                                <th className="px-4 py-3 font-bold">آیتم منو</th><th className="px-4 py-3 font-bold">تخفیف</th><th className="px-4 py-3 font-bold">بازه</th><th className="px-4 py-3 font-bold">وضعیت</th><th className="px-4 py-3 font-bold"></th>
                            </tr></thead>
                            <tbody>
                                {loading ? [0, 1, 2].map((i) => <tr key={i} className="border-t border-border"><td colSpan={5} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                                    : discounts.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-muted-fg">تخفیفی ثبت نشده است.</td></tr>
                                        : discounts.map((d) => (
                                            <tr key={d._id} className="border-t border-border hover:bg-surface-sunken/50">
                                                <td className="px-4 py-3 font-bold">{d.menuItem?.name || "آیتم حذف‌شده"}{d.menuItem && <span className="text-super-xs text-muted-fg mr-1.5">{CAT_LABEL[d.menuItem.category] || ""}</span>}</td>
                                                <td className="px-4 py-3 font-bold tabular-nums">{val(d.discountType, d.discountValue)}</td>
                                                <td className="px-4 py-3 text-super-xs text-muted-fg tabular-nums">{faDate(d.startDate)} تا {faDate(d.endDate)}</td>
                                                <td className="px-4 py-3">{isActive(d.active, d.endDate) ? <span className="text-super-xs font-bold bg-status-delivered-subtle text-status-delivered px-2.5 py-1 rounded-full">فعال</span> : <span className="text-super-xs font-bold bg-surface-sunken text-muted-fg px-2.5 py-1 rounded-full">منقضی</span>}</td>
                                                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => setDiscountModal({ discount: d })} aria-label="ویرایش" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-foreground"><EditIcon className="w-4 h-4" /></button><button onClick={() => onDelDiscount(d)} aria-label="حذف" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40"><TrashIcon className="w-4 h-4" /></button></div></td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            <CouponModal open={!!couponModal} onClose={() => setCouponModal(null)} coupon={couponModal?.coupon} onSaved={load} />
            <DiscountModal open={!!discountModal} onClose={() => setDiscountModal(null)} menus={menus} discount={discountModal?.discount} onSaved={load} />
        </div>
    );
};

export default AdminPromotions;
