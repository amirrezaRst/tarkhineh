"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import { Skeleton } from "@/components/Skeleton";
import { updateSettings } from "@/services/AdminService";
import SlidesManager from "./SlidesManager";

const FIELDS = [
    { key: "deliveryFee", label: "هزینهٔ ارسال پیش‌فرض", unit: "تومان", hint: "برای سفارش‌های ارسال با پیک" },
    { key: "serviceFee", label: "هزینهٔ خدمات هر سفارش", unit: "تومان", hint: "هزینهٔ ثابت به‌ازای هر سفارش" },
    { key: "minOrder", label: "حداقل مبلغ سفارش", unit: "تومان", hint: "کمترین مبلغ لازم برای ثبت سفارش" },
    { key: "taxPercent", label: "درصد مالیات / ارزش افزوده", unit: "٪", hint: "بین ۰ تا ۱۰۰" },
];

const AdminSettings = () => {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        api.get("/admin/settings")
            .then((res) => setForm(res.data.settings))
            .catch(() => toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."))
            .finally(() => setLoading(false));
    }, []);

    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const save = async (e) => {
        e.preventDefault();
        setBusy(true);
        await updateSettings({
            deliveryFee: Number(form.deliveryFee) || 0,
            serviceFee: Number(form.serviceFee) || 0,
            minOrder: Number(form.minOrder) || 0,
            taxPercent: Number(form.taxPercent) || 0,
            supportPhone: form.supportPhone || null,
        }, (s) => setForm(s));
        setBusy(false);
    };

    if (loading) return <div className="w-full max-w-3xl"><PanelPageHeader title="تنظیمات پلتفرم" subtitle="پیکربندی سراسری فروشگاه" /><Skeleton className="h-96 rounded-2xl" /></div>;

    const inp = "w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40";

    return (
        <div className="w-full max-w-3xl space-y-6">
            <PanelPageHeader title="تنظیمات پلتفرم" subtitle="این مقادیر سراسری روی کل فروشگاه اعمال می‌شوند" />
            <Card className="p-6">
                <form onSubmit={save} className="space-y-4">
                    {FIELDS.map((f) => (
                        <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="sm:w-56 shrink-0">
                                <label className="text-super-sm font-bold">{f.label}</label>
                                <p className="text-super-xs text-muted-fg mt-0.5">{f.hint}</p>
                            </div>
                            <div className="relative flex-1">
                                <input value={form[f.key] ?? 0} onChange={(e) => set(f.key, e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className={`${inp} pl-16`} />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-super-xs text-muted-fg">{f.unit}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="sm:w-56 shrink-0"><label className="text-super-sm font-bold">تلفن پشتیبانی</label><p className="text-super-xs text-muted-fg mt-0.5">نمایش به مشتریان</p></div>
                        <input value={form.supportPhone || ""} onChange={(e) => set("supportPhone", e.target.value)} className={`${inp} flex-1`} placeholder="۰۲۱-…" />
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                        <p className="text-super-xs text-muted-fg">نمونه: هزینهٔ ارسال فعلی <b className="tabular-nums">{PersianNumber(form.deliveryFee ?? 0)}</b> تومان</p>
                        <button type="submit" disabled={busy} className="bg-primary text-primary-fg rounded-xl px-6 py-2.5 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">{busy ? "در حال ذخیره…" : "ذخیرهٔ تنظیمات"}</button>
                    </div>
                </form>
            </Card>

            <SlidesManager />
        </div>
    );
};

export default AdminSettings;
