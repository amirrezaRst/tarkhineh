"use client";

import { useState } from "react";
import Modal from "@/components/panel/Modal";
import { createSlide, updateSlide } from "@/services/AdminService";
import { slideImg } from "../adminUtils";
import { ImageIcon } from "../icons";

// Create or edit a hero-slide: background image + title/subtitle + an
// optional button (text + link). The button is only meaningful if both
// buttonText and buttonLink are filled in, so the public carousel can decide
// whether to render one at all.
const SlideFormModal = ({ open, onClose, slide, onSaved }) => {
    const editing = !!slide;
    const [title, setTitle] = useState(slide?.title || "");
    const [subtitle, setSubtitle] = useState(slide?.subtitle || "");
    const [buttonText, setButtonText] = useState(slide?.buttonText || "");
    const [buttonLink, setButtonLink] = useState(slide?.buttonLink || "");
    const [active, setActive] = useState(slide?.active ?? true);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(slide?.image ? slideImg(slide.image) : null);
    const [busy, setBusy] = useState(false);

    const pickFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!editing && !file) return;
        setBusy(true);
        const data = { title, subtitle, buttonText, buttonLink, active };
        const ok = editing ? await updateSlide(slide._id, data, file) : await createSlide(file, data);
        setBusy(false);
        if (!ok) return;
        onSaved?.();
        onClose();
    };

    const inp = "w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40";
    const lbl = "block text-super-xs font-bold mb-1.5";

    return (
        <Modal open={open} onClose={onClose} size="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-5">{editing ? "ویرایش اسلاید" : "اسلاید جدید"}</h2>

                <label className={lbl}>تصویر پس‌زمینه <span className="font-normal text-muted-fg">(عریض، حدود ۱۶۰۰×۶۰۰)</span></label>
                <label className="relative block w-full h-36 rounded-xl border-2 border-dashed border-border-strong bg-surface-sunken overflow-hidden cursor-pointer hover:border-primary transition-colors mb-4">
                    {preview
                        ? <img src={preview} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full grid place-items-center text-subtle-fg"><ImageIcon className="w-7 h-7" /></div>
                    }
                    <input type="file" accept="image/jpeg,image/png" onChange={pickFile} className="hidden" />
                </label>

                <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2"><label className={lbl}>عنوان اصلی</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={inp} placeholder="تجربه غذای سالم و گیاهی..." /></div>
                    <div className="sm:col-span-2"><label className={lbl}>زیرعنوان (اختیاری)</label><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>متن دکمه (اختیاری)</label><input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className={inp} placeholder="سفارش آنلاین غذا" /></div>
                    <div><label className={lbl}>لینک دکمه</label><input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} className={`${inp} text-left`} dir="ltr" placeholder="/menus" /></div>
                </div>

                <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-super-sm font-bold">فعال (در سایت نمایش داده شود)</span>
                </label>

                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={busy || (!editing && !file)} className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                        {busy ? "در حال ذخیره…" : editing ? "ذخیرهٔ تغییرات" : "افزودن اسلاید"}
                    </button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default SlideFormModal;
