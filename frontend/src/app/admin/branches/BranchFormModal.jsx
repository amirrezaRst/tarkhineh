"use client";

import { useState } from "react";
import Modal from "@/components/panel/Modal";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { createBranch, updateBranch } from "@/services/AdminService";
import UserPicker from "./UserPicker";

// Create or edit a branch. On create the manager is required (Branch.manager is a
// required ref); on edit the manager can be reassigned (optional).
const BranchFormModal = ({ open, onClose, branch, onSaved }) => {
    const editing = !!branch;
    const [name, setName] = useState(branch?.name || "");
    const [capacity, setCapacity] = useState(branch?.courierCapacity ?? 3);
    const [manager, setManager] = useState(branch?.manager || null);
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (!editing && !manager) return;
        setBusy(true);
        const ok = editing
            ? await updateBranch(branch._id, { name, courierCapacity: Number(capacity), ...(manager && manager._id !== branch.manager?._id ? { managerId: manager._id } : {}) }, onSaved)
            : await createBranch({ name, courierCapacity: Number(capacity), managerId: manager._id }, onSaved);
        setBusy(false);
        if (ok) onClose();
    };

    return (
        <Modal open={open} onClose={onClose} size="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-5">{editing ? "ویرایش شعبه" : "شعبهٔ جدید"}</h2>

                <label className="block text-super-sm font-bold mb-1.5">نام شعبه</label>
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface mb-4 focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="مثلاً ونک" />

                <label className="block text-super-sm font-bold mb-1.5">{editing ? "تغییر مدیر شعبه (اختیاری)" : "مدیر شعبه"}</label>
                <div className="mb-1.5"><UserPicker value={manager} onChange={setManager} /></div>
                <p className="text-super-xs text-muted-fg mb-4">کاربر انتخاب‌شده به‌طور خودکار به نقش «مدیر شعبه» ارتقا می‌یابد.</p>

                <label className="block text-super-sm font-bold mb-1.5">ظرفیت هم‌زمان هر پیک</label>
                <div className="flex items-center gap-2 mb-6">
                    <button type="button" onClick={() => setCapacity((c) => Math.max(1, Number(c) - 1))} className="w-9 h-9 rounded-lg border border-border grid place-items-center font-bold">−</button>
                    <span className="w-12 text-center font-extrabold tabular-nums text-super-base">{PersianNumber(capacity)}</span>
                    <button type="button" onClick={() => setCapacity((c) => Number(c) + 1)} className="w-9 h-9 rounded-lg border border-border grid place-items-center font-bold">＋</button>
                    <span className="text-super-xs text-muted-fg mr-2">سفارش فعال هم‌زمان</span>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={busy || !name.trim() || (!editing && !manager)}
                        className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                        {busy ? "در حال ذخیره…" : editing ? "ذخیرهٔ تغییرات" : "ایجاد شعبه"}
                    </button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default BranchFormModal;
