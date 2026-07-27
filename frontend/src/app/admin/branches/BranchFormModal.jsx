"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/panel/Modal";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { createBranch, updateBranch, setBranchImages } from "@/services/AdminService";
import { branchImg } from "../adminUtils";
import { PlusIcon, CloseIcon, ImageIcon } from "../icons";
import UserPicker from "./UserPicker";

// Create or edit a branch with full profile: name, manager, address, phone,
// working hours, capacity and a gallery of images (shown to customers).
const BranchFormModal = ({ open, onClose, branch, onSaved }) => {
    const editing = !!branch;
    const [name, setName] = useState(branch?.name || "");
    const [capacity, setCapacity] = useState(branch?.courierCapacity ?? 3);
    const [manager, setManager] = useState(branch?.manager || null);
    const [address, setAddress] = useState(branch?.address || "");
    const [phoneNumber, setPhoneNumber] = useState(branch?.phoneNumber || "");
    const [openTime, setOpenTime] = useState(branch?.openTime || "");
    const [closeTime, setCloseTime] = useState(branch?.closeTime || "");
    // images: [{ existing: filename } | { file: File }], each with a preview url
    const [images, setImages] = useState(() => (branch?.images || []).map((n) => ({ existing: n, url: branchImg(n) })));
    const [busy, setBusy] = useState(false);

    const addFiles = (e) => {
        const files = Array.from(e.target.files || []);
        setImages((cur) => [...cur, ...files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))].slice(0, 6));
        e.target.value = "";
    };
    const removeImage = (i) => setImages((cur) => cur.filter((_, idx) => idx !== i));

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim() || (!editing && !manager)) return;
        setBusy(true);

        const payload = {
            name, courierCapacity: Number(capacity), address, phoneNumber, openTime, closeTime,
            ...(manager && manager._id !== branch?.manager?._id ? { managerId: manager._id } : {}),
        };

        let id = branch?._id;
        if (editing) {
            const ok = await updateBranch(id, payload);
            if (!ok) { setBusy(false); return; }
        } else {
            const created = await createBranch(payload);
            if (!created?._id) { setBusy(false); return; }
            id = created._id;
        }

        // images: keep existing filenames still present + upload new files
        const keep = images.filter((im) => im.existing).map((im) => im.existing);
        const newFiles = images.filter((im) => im.file).map((im) => im.file);
        const prev = branch?.images || [];
        const imagesChanged = newFiles.length > 0 || keep.length !== prev.length;
        if (imagesChanged) await setBranchImages(id, newFiles, keep);

        setBusy(false);
        toast.success(editing ? "شعبه به‌روزرسانی شد." : "شعبه ایجاد شد.");
        onSaved?.();
        onClose();
    };

    const inp = "w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40";
    const lbl = "block text-super-xs font-bold mb-1.5";

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-5">{editing ? "ویرایش شعبه" : "شعبهٔ جدید"}</h2>

                {/* images */}
                <label className={lbl}>تصاویر شعبه <span className="font-normal text-muted-fg">(حداکثر ۶ — به مشتری نمایش داده می‌شود)</span></label>
                <div className="flex flex-wrap gap-2.5 mb-4">
                    {images.map((im, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                            <img src={im.url} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(i)} aria-label="حذف تصویر" className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/55 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon className="w-3 h-3" /></button>
                        </div>
                    ))}
                    {images.length < 6 && (
                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border-strong bg-surface-sunken grid place-items-center text-subtle-fg cursor-pointer hover:border-primary transition-colors">
                            <ImageIcon className="w-6 h-6" />
                            <input type="file" accept="image/jpeg,image/png" multiple onChange={addFiles} className="hidden" />
                        </label>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                    <div><label className={lbl}>نام شعبه</label><input value={name} onChange={(e) => setName(e.target.value)} autoFocus className={inp} placeholder="مثلاً ونک" /></div>
                    <div><label className={lbl}>تلفن</label><input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={`${inp} tabular-nums`} placeholder="۰۲۱-…" /></div>
                    <div className="sm:col-span-2"><label className={lbl}>آدرس</label><input value={address} onChange={(e) => setAddress(e.target.value)} className={inp} placeholder="تهران، خیابان…" /></div>
                    <div className="sm:col-span-2">
                        <label className={lbl}>{editing ? "تغییر مدیر شعبه (اختیاری)" : "مدیر شعبه"}</label>
                        <UserPicker value={manager} onChange={setManager} />
                        <p className="text-super-xs text-muted-fg mt-1.5">کاربر انتخاب‌شده به‌طور خودکار به نقش «مدیر شعبه» ارتقا می‌یابد.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className={lbl}>ساعت باز شدن</label><input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className={`${inp} tabular-nums`} /></div>
                        <div><label className={lbl}>ساعت بسته شدن</label><input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className={`${inp} tabular-nums`} /></div>
                    </div>
                    <div>
                        <label className={lbl}>ظرفیت هم‌زمان هر پیک</label>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setCapacity((c) => Math.max(1, Number(c) - 1))} className="w-9 h-9 rounded-lg border border-border grid place-items-center font-bold shrink-0">−</button>
                            <span className="flex-1 text-center font-extrabold tabular-nums text-super-base">{PersianNumber(capacity)}</span>
                            <button type="button" onClick={() => setCapacity((c) => Number(c) + 1)} className="w-9 h-9 rounded-lg border border-border grid place-items-center font-bold shrink-0"><PlusIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={busy || !name.trim() || (!editing && !manager)} className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                        {busy ? "در حال ذخیره…" : editing ? "ذخیرهٔ تغییرات" : "ایجاد شعبه"}
                    </button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default BranchFormModal;
