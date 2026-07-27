"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PanelSidebar from "./PanelSidebar";
import useUserStore from "@/stores/useUserStore";
import { branchNamesDic } from "@/constant/branchDictionary";
import { setAvailability } from "@/services/CourierService";
import AdminBell from "./AdminBell";
import GlobalSearch from "./GlobalSearch";

// Topbar title per route. The dashboard greets by name; sub-pages name the
// section. Falls back to a neutral title for any unmapped panel route.
const titleForPath = (pathname, name) => {
    const map = {
        "/admin": name ? `خوش آمدید، ${name}` : "داشبورد کل",
        "/admin/orders": "سفارش‌های سراسری",
        "/admin/couriers": "پیک‌های سراسری",
        "/admin/branches": "مدیریت شعبه‌ها",
        "/admin/users": "کاربران و نقش‌ها",
        "/admin/menu": "منوی کاتالوگ",
        "/admin/finance": "مالی و پرداخت‌ها",
        "/admin/promotions": "کوپن و تخفیف",
        "/admin/reviews": "نظرات و امتیازها",
        "/admin/customers": "تحلیل مشتریان",
        "/admin/reports": "گزارشات و تحلیل کل",
        "/admin/settings": "تنظیمات پلتفرم",
        "/panel/branch": name ? `خوش آمدید، ${name}` : "خوش آمدید",
        "/panel/branch/orders": "مدیریت سفارش‌ها",
        "/panel/branch/menu": "منوی شعبه",
        "/panel/branch/couriers": "پیک‌های شعبه",
        "/panel/branch/reports": "گزارشات و تحلیل",
        "/panel/courier": name ? `سلام، ${name}` : "خوش آمدید",
        "/panel/courier/orders": "تحویل‌های فعال",
        "/panel/courier/history": "تاریخچهٔ تحویل",
        "/panel/courier/earnings": "درآمد و تسویه",
        "/panel/courier/profile": "پروفایل و عملکرد",
    };
    return map[pathname] || "پنل مدیریت";
};

// Courier online/offline switch — updates courierStatus and the user store so
// the whole panel reflects availability immediately.
const CourierAvailabilityToggle = () => {
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const [busy, setBusy] = useState(false);
    const online = user?.courierStatus !== "offline";

    const toggle = async (next) => {
        if (busy || (next === "available") === online) return;
        setBusy(true);
        await setAvailability(next, (s) => setUser({ ...user, courierStatus: s }));
        setBusy(false);
    };

    return (
        <div className="inline-flex bg-surface-sunken border border-border rounded-full p-1 gap-1" role="group" aria-label="وضعیت فعالیت">
            <button onClick={() => toggle("available")} disabled={busy} aria-pressed={online}
                className={`inline-flex items-center gap-1.5 text-super-xs font-extrabold px-3.5 py-2 rounded-full transition-colors ${online ? "bg-primary text-primary-fg" : "text-muted-fg hover:text-foreground"}`}>
                {online && (
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                    </span>
                )}
                آنلاین
            </button>
            <button onClick={() => toggle("offline")} disabled={busy} aria-pressed={!online}
                className={`text-super-xs font-extrabold px-3.5 py-2 rounded-full transition-colors ${!online ? "bg-muted-fg text-white" : "text-muted-fg hover:text-foreground"}`}>
                آفلاین
            </button>
        </div>
    );
};

// At-a-glance store open/closed indicator. Interactive locally; persisting the
// real open/closed state needs the Branch working-hours field (a later phase),
// so this reflects UI intent only for now.
const StoreStatusPill = () => {
    const [open, setOpen] = useState(true);
    return (
        <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-pressed={open}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-super-xs font-bold border transition-colors ${open
                ? "bg-primary-subtle text-primary border-primary/20"
                : "bg-surface-sunken text-muted-fg border-border"
                }`}
            title={open ? "شعبه در حال پذیرش سفارش است" : "شعبه بسته است"}
        >
            {open ? (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
            ) : (
                <span className="inline-flex rounded-full h-2 w-2 bg-muted-fg" />
            )}
            {open ? "شعبه باز است" : "شعبه بسته است"}
        </button>
    );
};

const PanelLayout = ({ children }) => {
    const user = useUserStore((state) => state.user);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const pathname = usePathname();

    // The panel lives outside MainLayout, which is what normally hydrates the
    // user store via the Navbar. Without this, `user` stays null on every panel
    // page — the sidebar renders no items and data-fetch effects that key off
    // user.branch never run. The middleware guarantees a valid session reached
    // here, so fetchUser will resolve to the real user.
    useEffect(() => {
        if (!user) fetchUser();
    }, [user, fetchUser]);

    if (!user) {
        return (
            <div className="bg-panel-ground w-full h-screen flex items-center justify-center">
                <span className="text-muted-fg">در حال بارگذاری...</span>
            </div>
        );
    }

    const today = new Date().toLocaleDateString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const branchName = user.branch ? branchNamesDic[user.branch] : null;

    return (
        <div className="bg-panel-ground flex w-full h-screen overflow-hidden" dir="rtl">
            <PanelSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top bar */}
                <header className="shrink-0 h-[68px] bg-surface border-b border-border/70 flex items-center justify-between gap-4 px-6 md:px-8">
                    <div className="min-w-0">
                        <p className="text-foreground font-extrabold text-super-base truncate">
                            {titleForPath(pathname, user.fullName)}
                        </p>
                        <p className="text-muted-fg text-super-xs mt-0.5">
                            {today}{branchName ? ` · شعبه ${branchName}` : ""}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        {user.role === "courier" ? (
                            <CourierAvailabilityToggle />
                        ) : user.role === "admin" ? (
                            <>
                                <GlobalSearch />
                                <AdminBell />
                            </>
                        ) : (
                            <>
                                <StoreStatusPill />
                                <button
                                    type="button"
                                    aria-label="اعلان‌ها"
                                    className="w-10 h-10 rounded-xl border border-border bg-surface-sunken grid place-items-center text-muted-fg hover:text-foreground hover:border-border-strong transition-colors"
                                >
                                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {/*//! START MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto px-6 md:px-8 py-7">
                    {children}
                </main>
                {/*//? END MAIN CONTENT */}
            </div>
        </div>
    );
}

export default PanelLayout;
