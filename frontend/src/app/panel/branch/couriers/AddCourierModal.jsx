"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/panel/Modal";
import { createCourier } from "@/services/BranchManagerService";

const VEHICLES = [
    { v: "motorcycle", l: "موتورسیکلت" },
    { v: "bicycle", l: "دوچرخه" },
    { v: "car", l: "خودرو" },
    { v: "foot", l: "پیاده" },
];

const AddCourierModal = ({ open, onClose, branch, onCreated }) => {
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [form, setForm] = useState({ fullName: "", phoneNumber: "", nationalCode: "", vehicleType: "motorcycle", plateNumber: "" });
    const [busy, setBusy] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const pickFile = (f) => {
        if (!f) return;
        if (!/\.(jpe?g|png)$/i.test(f.name)) return toast.error("فقط تصویر JPG یا PNG مجاز است.");
        if (f.size > 2_000_000) return toast.error("حجم تصویر باید کمتر از ۲ مگابایت باشد.");
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const reset = () => {
        setForm({ fullName: "", phoneNumber: "", nationalCode: "", vehicleType: "motorcycle", plateNumber: "" });
        setFile(null); setPreview(null);
    };

    const submit = async () => {
        if (!/^09\d{9}$/.test(form.phoneNumber)) return toast.error("شماره موبایل معتبر نیست.");
        setBusy(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        if (file) fd.append("image", file);
        const ok = await createCourier(branch, fd, onCreated);
        setBusy(false);
        if (ok) { reset(); onClose(); }
    };

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-super-base font-extrabold">افزودن پیک جدید</h2>
                <button onClick={onClose} aria-label="بستن" className="w-8 h-8 grid place-items-center rounded-lg text-muted-fg hover:bg-surface-sunken">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
            </div>

            <div className="p-5 grid sm:grid-cols-[190px_1fr] gap-6">
                {/* photo */}
                <div>
                    <label className="block text-super-xs font-bold mb-2">تصویر پیک</label>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }}
                        className="w-full aspect-square rounded-2xl border-2 border-dashed border-border-strong bg-surface-sunken grid place-items-center text-subtle-fg overflow-hidden hover:border-primary transition-colors"
                    >
                        {preview ? (
                            <img src={preview} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 px-4 text-center">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 16V6m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                                <span className="text-super-xs">برای انتخاب کلیک کنید<br />یا تصویر را رها کنید</span>
                                <span className="text-[10.5px] text-subtle-fg">JPG / PNG — حداکثر ۲MB</span>
                            </div>
                        )}
                    </button>
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
                </div>

                {/* fields */}
                <div>
                    <Field label="نام و نام خانوادگی"><input value={form.fullName} onChange={set("fullName")} placeholder="مثلاً محمد احمدی" className="inp" /></Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="شماره موبایل"><input value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="09xxxxxxxxx" inputMode="numeric" className="inp tabular-nums" /></Field>
                        <Field label="کد ملی"><input value={form.nationalCode} onChange={set("nationalCode")} placeholder="کد ملی" inputMode="numeric" className="inp tabular-nums" /></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="نوع وسیله"><select value={form.vehicleType} onChange={set("vehicleType")} className="inp">{VEHICLES.map((v) => <option key={v.v} value={v.v}>{v.l}</option>)}</select></Field>
                        <Field label="شمارهٔ پلاک"><input value={form.plateNumber} onChange={set("plateNumber")} placeholder="۱۲ ج ۳۴۵" className="inp" /></Field>
                    </div>

                    <div className="flex items-center gap-2 text-super-xs text-muted-fg bg-surface-sunken border border-border rounded-xl px-3 py-2.5 mb-4">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.6" /><path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span>وضعیت اولیه <b className="text-primary">آزاد</b> و ظرفیت هم‌زمان (تنظیم سراسری) خودکار اعمال می‌شود.</span>
                    </div>

                    <div className="flex gap-2.5">
                        <button onClick={submit} disabled={busy} className="bg-primary text-primary-fg rounded-xl px-5 py-2.5 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                            {busy ? "در حال ثبت…" : "ثبت پیک"}
                        </button>
                        <button onClick={onClose} className="bg-surface-sunken text-muted-fg rounded-xl px-5 py-2.5 text-super-sm font-bold">انصراف</button>
                    </div>
                </div>
            </div>

            <style jsx>{`.inp{width:100%;font-family:inherit;font-size:13px;padding:10px 12px;border:1px solid hsl(var(--border));border-radius:11px;background:hsl(var(--surface));color:hsl(var(--foreground));}`}</style>
        </Modal>
    );
};

const Field = ({ label, children }) => (
    <div className="mb-3.5">
        <label className="block text-super-xs font-bold mb-1.5">{label}</label>
        {children}
    </div>
);

export default AddCourierModal;
