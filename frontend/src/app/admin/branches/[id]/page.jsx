"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import Card from "@/components/panel/Card";
import MetricBar from "@/components/panel/MetricBar";
import BarChart from "@/components/panel/charts/BarChart";
import { Skeleton } from "@/components/Skeleton";
import { Avatar, StatusPill, STATUS_META, branchImg } from "../../adminUtils";
import { EditIcon, TrashIcon } from "../../icons";
import { deleteBranch } from "@/services/AdminService";
import BranchFormModal from "../BranchFormModal";
import { courierImg, VEHICLE_LABEL } from "../../../panel/branch/couriers/courierUtils";

const faTime = (d) => new Date(d).toLocaleString("fa-IR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const OpenPill = ({ isOpen }) => {
    if (isOpen === null || isOpen === undefined) return <span className="text-super-xs font-bold px-3 py-1.5 rounded-full bg-surface-sunken text-muted-fg">ساعت کاری ثبت نشده</span>;
    return isOpen
        ? <span className="inline-flex items-center gap-2 text-super-xs font-bold px-3 py-1.5 rounded-full bg-status-delivered-subtle text-status-delivered"><span className="w-2 h-2 rounded-full bg-current" /> باز است</span>
        : <span className="inline-flex items-center gap-2 text-super-xs font-bold px-3 py-1.5 rounded-full bg-status-cancelled-subtle text-status-cancelled"><span className="w-2 h-2 rounded-full bg-current" /> بسته است</span>;
};

const AdminBranchDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/branches/${id}`);
            setData(res.data);
        } catch (err) { toast.error(err?.status === 404 ? "شعبه یافت نشد." : "خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
        finally { setLoading(false); }
    }, [id]);
    useEffect(() => { load(); }, [load]);

    if (loading) return <div className="w-full space-y-4"><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" /><div className="grid lg:grid-cols-2 gap-4"><Skeleton className="h-64 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div></div>;
    if (!data) return null;

    const onDelete = async () => {
        if (!confirm(`شعبهٔ «${data.branch.name}» حذف شود؟`)) return;
        setBusy(true);
        await deleteBranch(data.branch._id, () => router.push("/admin/branches"));
        setBusy(false);
    };

    const b = data.branch, s = data.stats;
    const series = (data.revenueSeries || []).map((d) => ({ label: d.label, value: d.value }));
    const couriers = data.couriers || [];
    const recent = data.recentOrders || [];
    const st = data.statusToday || {};

    return (
        <div className="w-full">
            <button onClick={() => router.push("/admin/branches")} className="text-super-xs text-muted-fg hover:text-foreground mb-3 inline-flex items-center gap-1">‹ بازگشت به شعبه‌ها</button>

            <Card className="p-5 mb-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{b.name}</h1>
                            <OpenPill isOpen={b.isOpen} />
                        </div>
                        <div className="text-super-sm text-muted-fg mt-1.5">{b.address || "آدرس ثبت نشده"}{b.phoneNumber ? ` · ${b.phoneNumber}` : ""}</div>
                        <div className="text-super-xs text-subtle-fg mt-1 tabular-nums">
                            {b.openTime && b.closeTime ? `ساعت کاری: ${b.openTime} تا ${b.closeTime}` : "ساعت کاری تعیین نشده"} · ظرفیت هر پیک: {PersianNumber(b.courierCapacity)}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {b.manager && <div className="flex items-center gap-2"><Avatar name={b.manager.fullName} phone={b.manager.phoneNumber} role="branch_manager" size={36} /><div><div className="text-super-sm font-bold">{b.manager.fullName || "—"}</div><div className="text-super-xs text-muted-fg">مدیر شعبه</div></div></div>}
                        <button onClick={() => setEdit(true)} className="inline-flex items-center gap-2 bg-surface-sunken border border-border rounded-xl px-4 py-2.5 text-super-sm font-bold hover:border-border-strong"><EditIcon className="w-4 h-4" /> ویرایش</button>
                        <button onClick={onDelete} disabled={busy} aria-label="حذف شعبه" title="حذف شعبه" className="w-10 h-10 rounded-xl border border-border grid place-items-center text-muted-fg hover:text-destructive hover:border-destructive/40 disabled:opacity-50"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                </div>
                {b.images?.length > 0 && (
                    <div className="flex gap-2.5 mt-4 pt-4 border-t border-border overflow-x-auto">
                        {b.images.map((im, i) => (
                            <img key={i} src={branchImg(im)} alt={`${b.name} ${i + 1}`} className="w-28 h-20 rounded-xl object-cover border border-border shrink-0" />
                        ))}
                    </div>
                )}
            </Card>

            <div className="mb-4">
                <MetricBar items={[
                    { value: FormatPrice(s.revenueMonth ?? 0), label: "درآمد ماه (ت)" },
                    { value: PersianNumber(s.ordersMonth ?? 0), label: "سفارش ماه" },
                    { value: PersianNumber(s.couriers ?? 0), label: "پیک" },
                    { value: PersianNumber(s.menuCount ?? 0), label: "آیتم منو" },
                    { value: s.avgRating != null ? `${PersianNumber(s.avgRating)} (${PersianNumber(s.reviews)})` : "—", label: "رضایت (نظر)" },
                ]} />
            </div>

            <div className="grid lg:grid-cols-2 gap-4 items-start">
                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">درآمد ۷ روز اخیر</h2>
                    <BarChart data={series} height={150} formatValue={(v) => `${FormatPrice(v)} تومان`} />
                </Card>

                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">وضعیت سفارش‌های امروز</h2>
                    <div className="space-y-2.5">
                        {Object.keys(STATUS_META).map((k) => (
                            <div key={k} className="flex items-center gap-2 text-super-sm">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_META[k].color }} />
                                <span className="text-muted-fg">{STATUS_META[k].label}</span>
                                <b className="mr-auto tabular-nums">{PersianNumber(st[k] || 0)}</b>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">پیک‌های شعبه</h2>
                    {couriers.length === 0 ? <p className="text-muted-fg text-super-sm py-4 text-center">پیکی ندارد.</p> : (
                        <div className="space-y-2.5">
                            {couriers.map((c) => (
                                <div key={c._id} className="flex items-center gap-2.5">
                                    <Avatar name={c.fullName} phone={c.phoneNumber} role="courier" src={courierImg(c.image)} size={34} />
                                    <div className="min-w-0 flex-1"><div className="font-bold text-super-sm truncate">{c.fullName || "بدون نام"}</div><div className="text-super-xs text-muted-fg">{VEHICLE_LABEL[c.vehicleType] || "—"}</div></div>
                                    <span className={`text-super-xs font-bold px-2 py-0.5 rounded-full ${c.courierStatus === "available" ? "bg-status-delivered-subtle text-status-delivered" : "bg-surface-sunken text-muted-fg"}`}>{c.courierStatus === "available" ? "آنلاین" : "آفلاین"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="p-5">
                    <h2 className="text-super-base font-extrabold mb-4">سفارش‌های اخیر</h2>
                    {recent.length === 0 ? <p className="text-muted-fg text-super-sm py-4 text-center">سفارشی ندارد.</p> : (
                        <div className="space-y-2">
                            {recent.map((o) => (
                                <div key={o._id} className="flex items-center gap-3 text-super-sm py-1.5 border-b border-border last:border-0">
                                    <span className="font-extrabold text-primary-hover text-super-xs tabular-nums">#{PersianNumber(String(o._id).slice(-5))}</span>
                                    <span className="flex-1 truncate">{o.user?.fullName || "مشتری"}</span>
                                    <StatusPill status={o.status} />
                                    <span className="tabular-nums font-bold whitespace-nowrap">{FormatPrice(o.finalPrice)} ت</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <BranchFormModal open={edit} onClose={() => setEdit(false)} branch={b} onSaved={load} />
        </div>
    );
};

export default AdminBranchDetail;
