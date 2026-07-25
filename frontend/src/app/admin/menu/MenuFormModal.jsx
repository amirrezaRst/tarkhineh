"use client";

import { useState } from "react";
import Modal from "@/components/panel/Modal";
import { createMenuItem, updateMenuItem } from "@/services/AdminService";
import { CAT_LABEL, FOOD_TYPE_LABEL, menuImg } from "../adminUtils";

const CATS = ["main", "side", "dessert", "drink"];
const FOOD_TYPES = ["iranian", "non-iranian", "pizza", "sandwich"];
const isMainSide = (c) => c === "main" || c === "side";

const MenuFormModal = ({ open, onClose, item, onSaved }) => {
    const editing = !!item;
    const [name, setName] = useState(item?.name || "");
    const [description, setDescription] = useState(item?.description || "");
    const [price, setPrice] = useState(item?.price || "");
    const [category, setCategory] = useState(item?.category || "main");
    const [foodType, setFoodType] = useState(item?.foodType || "iranian");
    const [isPersian, setIsPersian] = useState(item?.isPersian ?? true);
    const [available, setAvailable] = useState(item?.available ?? true);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(item ? menuImg(item.images) : null);
    const [busy, setBusy] = useState(false);

    const onFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const valid = name.trim() && description.trim() && Number(price) > 0;

    const submit = async (e) => {
        e.preventDefault();
        if (!valid) return;
        setBusy(true);
        const fd = new FormData();
        fd.append("name", name.trim());
        fd.append("description", description.trim());
        fd.append("price", String(Number(price)));
        fd.append("category", category);
        fd.append("available", String(available));
        if (isMainSide(category)) fd.append("foodType", foodType);
        else fd.append("isPersian", String(isPersian));
        if (file) fd.append("images", file);

        const ok = editing ? await updateMenuItem(item._id, fd, onSaved) : await createMenuItem(fd, onSaved);
        setBusy(false);
        if (ok) onClose();
    };

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-5">{editing ? "ویرایش آیتم منو" : "افزودن آیتم منو"}</h2>

                <div className="grid sm:grid-cols-[150px_1fr] gap-5">
                    {/* image */}
                    <div>
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-border-strong bg-surface-sunken grid place-items-center text-subtle-fg overflow-hidden cursor-pointer hover:border-primary transition-colors">
                            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : (
                                <span className="text-super-xs text-center px-2">＋ افزودن تصویر<br />(jpg / png)</span>
                            )}
                            <input type="file" accept="image/jpeg,image/png" onChange={onFile} className="hidden" />
                        </label>
                    </div>

                    {/* fields */}
                    <div className="space-y-3.5">
                        <div>
                            <label className="block text-super-xs font-bold mb-1.5">نام غذا</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        </div>
                        <div>
                            <label className="block text-super-xs font-bold mb-1.5">توضیحات</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-super-xs font-bold mb-1.5">قیمت (تومان)</label>
                                <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>
                            <div>
                                <label className="block text-super-xs font-bold mb-1.5">دسته‌بندی</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40">
                                    {CATS.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
                                </select>
                            </div>
                        </div>

                        {isMainSide(category) ? (
                            <div>
                                <label className="block text-super-xs font-bold mb-1.5">نوع غذا</label>
                                <select value={foodType} onChange={(e) => setFoodType(e.target.value)} className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40">
                                    {FOOD_TYPES.map((f) => <option key={f} value={f}>{FOOD_TYPE_LABEL[f]}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5">
                                <span className="text-super-sm font-bold">ایرانی است؟</span>
                                <button type="button" onClick={() => setIsPersian((v) => !v)} aria-pressed={isPersian}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${isPersian ? "bg-primary" : "bg-border-strong"}`}>
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${isPersian ? "right-0.5" : "left-0.5"}`} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5">
                            <span className="text-super-sm font-bold">موجود در منو</span>
                            <button type="button" onClick={() => setAvailable((v) => !v)} aria-pressed={available}
                                className={`w-11 h-6 rounded-full relative transition-colors ${available ? "bg-primary" : "bg-border-strong"}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${available ? "right-0.5" : "left-0.5"}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={busy || !valid} className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                        {busy ? "در حال ذخیره…" : editing ? "ذخیرهٔ تغییرات" : "افزودن به منو"}
                    </button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default MenuFormModal;
