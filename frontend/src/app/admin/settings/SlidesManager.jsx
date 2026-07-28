"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import Card from "@/components/panel/Card";
import { Skeleton } from "@/components/panel/Skeleton";
import { deleteSlide, reorderSlides, updateSlide } from "@/services/AdminService";
import { slideImg } from "../adminUtils";
import { PlusIcon, EditIcon, TrashIcon, ChevronRightIcon } from "../icons";
import SlideFormModal from "./SlideFormModal";

const SlidesManager = () => {
    const [slides, setSlides] = useState(null);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = () => {
        api.get("/admin/slides")
            .then((res) => setSlides(res.data.slides))
            .catch(() => toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."));
    };

    useEffect(load, []);

    const move = async (index, dir) => {
        const next = [...slides];
        const swapWith = index + dir;
        if (swapWith < 0 || swapWith >= next.length) return;
        [next[index], next[swapWith]] = [next[swapWith], next[index]];
        setSlides(next);
        await reorderSlides(next.map((s) => s._id));
    };

    const toggleActive = async (s) => {
        const ok = await updateSlide(s._id, { active: !s.active });
        if (ok) setSlides((cur) => cur.map((x) => (x._id === s._id ? { ...x, active: !s.active } : x)));
    };

    const onDelete = async (s) => {
        if (!confirm(`اسلاید «${s.title || "بدون عنوان"}» حذف شود؟`)) return;
        await deleteSlide(s._id, load);
    };

    if (slides === null) return <Card className="p-6"><Skeleton className="h-40" /></Card>;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-extrabold">اسلایدر صفحهٔ اصلی</h3>
                    <p className="text-super-xs text-muted-fg mt-0.5">تصویر و متنی که بالای صفحهٔ اصلی، منو و شعبه‌ها نمایش داده می‌شود</p>
                </div>
                <button onClick={() => { setEditing(null); setModal(true); }} className="flex items-center gap-1.5 bg-primary text-primary-fg rounded-xl px-4 py-2 text-super-xs font-bold hover:bg-primary-hover">
                    <PlusIcon className="w-4 h-4" /> اسلاید جدید
                </button>
            </div>

            {slides.length === 0 &&
                <p className="text-super-sm text-muted-fg py-8 text-center">هنوز اسلایدی اضافه نشده است.</p>
            }

            <div className="space-y-2.5">
                {slides.map((s, i) => (
                    <div key={s._id} className="flex items-center gap-3 border border-border rounded-xl p-2.5">
                        <div className="flex flex-col shrink-0">
                            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="w-6 h-5 grid place-items-center text-muted-fg disabled:opacity-25 hover:text-primary">
                                <ChevronRightIcon className="w-3.5 h-3.5 -rotate-90" />
                            </button>
                            <button type="button" disabled={i === slides.length - 1} onClick={() => move(i, 1)} className="w-6 h-5 grid place-items-center text-muted-fg disabled:opacity-25 hover:text-primary">
                                <ChevronRightIcon className="w-3.5 h-3.5 rotate-90" />
                            </button>
                        </div>

                        <div className="w-24 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-sunken">
                            <img src={slideImg(s.image)} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-super-sm truncate">{s.title || <span className="text-muted-fg font-normal">بدون عنوان</span>}</p>
                            {s.buttonText && s.buttonLink &&
                                <p className="text-super-xs text-muted-fg truncate mt-0.5">دکمه: {s.buttonText} ← {s.buttonLink}</p>
                            }
                        </div>

                        <label className="flex items-center gap-1.5 text-super-xs font-bold shrink-0 cursor-pointer select-none">
                            <input type="checkbox" checked={s.active} onChange={() => toggleActive(s)} className="w-4 h-4 accent-primary" />
                            فعال
                        </label>

                        <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => { setEditing(s); setModal(true); }} aria-label="ویرایش" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-primary hover:border-primary/40"><EditIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(s)} aria-label="حذف" className="w-8 h-8 rounded-lg border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <SlideFormModal open={modal} onClose={() => setModal(false)} slide={editing} onSaved={load} />
        </Card>
    );
};

export default SlidesManager;
