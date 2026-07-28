"use client";

import { useState } from "react";
import Modal from "@/components/panel/Modal";
import { createCoupon, updateCoupon } from "@/services/AdminService";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const CouponModal = ({ open, onClose, coupon, onSaved }) => {
    const editing = !!coupon;
    const [f, setF] = useState({
        code: coupon?.code || "",
        description: coupon?.description || "",
        discountType: coupon?.discountType || "percentage",
        discountValue: coupon?.discountValue || "",
        minAmount: coupon?.minAmount || "",
        maxAmount: coupon?.maxAmount || "",
        usageLimit: coupon?.usageLimit || 1,
        validFrom: toDateInput(coupon?.validFrom) || toDateInput(Date.now()),
        validTo: toDateInput(coupon?.validTo),
        active: coupon?.active !== false,
    });
    const [busy, setBusy] = useState(false);
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const valid = (editing || f.code.trim()) && Number(f.discountValue) > 0 && f.validFrom && f.validTo;

    const submit = async (e) => {
        e.preventDefault();
        if (!valid) return;
        setBusy(true);
        const payload = {
            description: f.description, discountType: f.discountType, discountValue: Number(f.discountValue),
            minAmount: f.minAmount ? Number(f.minAmount) : undefined, maxAmount: f.maxAmount ? Number(f.maxAmount) : undefined,
            usageLimit: Number(f.usageLimit) || 1, validFrom: f.validFrom, validTo: f.validTo, active: f.active,
        };
        const ok = editing ? await updateCoupon(coupon._id, payload, onSaved) : await createCoupon({ ...payload, code: f.code.trim() }, onSaved);
        setBusy(false);
        if (ok) onClose();
    };

    const inp = "w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40";
    const lbl = "block text-super-xs font-bold mb-1.5";

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-5">{editing ? `ویرایش کوپن ${coupon.code}` : "کوپن جدید"}</h2>

                <div className="grid sm:grid-cols-2 gap-3.5">
                    {!editing && (
                        <div className="sm:col-span-2"><label className={lbl}>کد کوپن</label>
                            <input value={f.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className={`${inp} tabular-nums tracking-wider`} placeholder="مثلاً NOWRUZ1404" /></div>
                    )}
                    <div className="sm:col-span-2"><label className={lbl}>توضیحات</label><input value={f.description} onChange={(e) => set("description", e.target.value)} className={inp} placeholder="اختیاری" /></div>
                    <div><label className={lbl}>نوع تخفیف</label>
                        <select value={f.discountType} onChange={(e) => set("discountType", e.target.value)} className={inp}><option value="percentage">درصدی</option><option value="flat">مبلغ ثابت</option></select></div>
                    <div><label className={lbl}>{f.discountType === "percentage" ? "درصد تخفیف" : "مبلغ تخفیف (ت)"}</label>
                        <input value={f.discountValue} onChange={(e) => set("discountValue", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className={`${inp} tabular-nums`} /></div>
                    <div><label className={lbl}>حداقل مبلغ سفارش (ت)</label><input value={f.minAmount} onChange={(e) => set("minAmount", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className={`${inp} tabular-nums`} placeholder="اختیاری" /></div>
                    <div><label className={lbl}>سقف تخفیف (ت)</label><input value={f.maxAmount} onChange={(e) => set("maxAmount", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className={`${inp} tabular-nums`} placeholder="اختیاری" /></div>
                    <div><label className={lbl}>سقف دفعات استفاده</label><input value={f.usageLimit} onChange={(e) => set("usageLimit", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className={`${inp} tabular-nums`} /></div>
                    <div><label className={lbl}>معتبر از</label><input type="date" value={f.validFrom} onChange={(e) => set("validFrom", e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>معتبر تا</label><input type="date" value={f.validTo} onChange={(e) => set("validTo", e.target.value)} className={inp} /></div>
                    <div className="sm:col-span-2 flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5">
                        <span className="text-super-sm font-bold">فعال</span>
                        <button type="button" onClick={() => set("active", !f.active)} aria-pressed={f.active} className={`w-11 h-6 rounded-full relative transition-colors ${f.active ? "bg-primary" : "bg-border-strong"}`}>
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${f.active ? "right-0.5" : "left-0.5"}`} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={busy || !valid} className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">{busy ? "در حال ذخیره…" : editing ? "ذخیره" : "ایجاد کوپن"}</button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default CouponModal;
