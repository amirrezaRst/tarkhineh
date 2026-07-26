"use client";

import { useState } from "react";
import Modal from "@/components/panel/Modal";
import { createDiscount } from "@/services/AdminService";
import { CAT_LABEL } from "../adminUtils";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const DiscountModal = ({ open, onClose, menus = [], onSaved }) => {
    const [f, setF] = useState({
        menuItem: "", discountType: "percentage", discountValue: "",
        startDate: toDateInput(Date.now()), endDate: "", active: true,
    });
    const [busy, setBusy] = useState(false);
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const valid = f.menuItem && Number(f.discountValue) > 0 && f.startDate && f.endDate;

    const submit = async (e) => {
        e.preventDefault();
        if (!valid) return;
        setBusy(true);
        const ok = await createDiscount({
            menuItem: f.menuItem, discountType: f.discountType, discountValue: Number(f.discountValue),
            startDate: f.startDate, endDate: f.endDate, active: f.active,
        }, onSaved);
        setBusy(false);
        if (ok) onClose();
    };

    const inp = "w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40";
    const lbl = "block text-super-xs font-bold mb-1.5";

    return (
        <Modal open={open} onClose={onClose} size="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-5">تخفیف روی آیتم منو</h2>
                <div className="space-y-3.5">
                    <div><label className={lbl}>آیتم منو</label>
                        <select value={f.menuItem} onChange={(e) => set("menuItem", e.target.value)} className={inp}>
                            <option value="">— انتخاب آیتم —</option>
                            {menus.map((m) => <option key={m._id} value={m._id}>{m.name} ({CAT_LABEL[m.category] || m.category})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={lbl}>نوع</label><select value={f.discountType} onChange={(e) => set("discountType", e.target.value)} className={inp}><option value="percentage">درصدی</option><option value="flat">مبلغ ثابت</option></select></div>
                        <div><label className={lbl}>{f.discountType === "percentage" ? "درصد" : "مبلغ (ت)"}</label><input value={f.discountValue} onChange={(e) => set("discountValue", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className={`${inp} tabular-nums`} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={lbl}>از تاریخ</label><input type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} className={inp} /></div>
                        <div><label className={lbl}>تا تاریخ</label><input type="date" value={f.endDate} onChange={(e) => set("endDate", e.target.value)} className={inp} /></div>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={busy || !valid} className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">{busy ? "در حال ذخیره…" : "ایجاد تخفیف"}</button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default DiscountModal;
