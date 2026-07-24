"use client";

import { DashboardIcon, DeliveryIcon, DiagramIcon, FastFoodIcon, FastFoodMenuIcon, HistoryIcon, LogoutIcon, UserIcon, WalletMoneyIcon } from "@/assets/Icons";
import useUserStore from "@/stores/useUserStore";
import useCartStore from "@/stores/useCartStore";
import { handleLogout } from "@/services/UserService";
import { branchNamesDic } from "@/constant/branchDictionary";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Nav grouped into sections per role. Icons are monochrome (recoloured via
// fill-current). Order within a group is by importance.
const sidebarByRole = {
    admin: [
        { section: null, items: [{ label: "داشبورد", href: "/admin", icon: DashboardIcon }] },
        {
            section: "مدیریت", items: [
                { label: "مدیریت رستوران‌ها", href: "/admin/restaurants", icon: FastFoodIcon },
                { label: "گزارشات کلی", href: "/admin/reports", icon: DiagramIcon },
            ]
        },
    ],
    branch_manager: [
        { section: null, items: [{ label: "داشبورد", href: "/panel/branch", icon: DashboardIcon }] },
        {
            section: "عملیات", items: [
                { label: "سفارش‌ها", href: "/panel/branch/orders", icon: FastFoodIcon },
                { label: "منو رستوران", href: "/panel/branch/menu", icon: FastFoodMenuIcon },
                { label: "پیک‌ها", href: "/panel/branch/couriers", icon: DeliveryIcon },
            ]
        },
        { section: "تحلیل", items: [{ label: "گزارشات", href: "/panel/branch/reports", icon: DiagramIcon }] },
    ],
    courier: [
        { section: null, items: [{ label: "داشبورد", href: "/panel/courier", icon: DashboardIcon }] },
        {
            section: "تحویل", items: [
                { label: "تحویل‌های فعال", href: "/panel/courier/orders", icon: DeliveryIcon },
                { label: "تاریخچهٔ تحویل", href: "/panel/courier/history", icon: HistoryIcon },
            ]
        },
        {
            section: "حساب", items: [
                { label: "درآمد و تسویه", href: "/panel/courier/earnings", icon: WalletMoneyIcon },
                { label: "پروفایل و عملکرد", href: "/panel/courier/profile", icon: UserIcon },
            ]
        },
    ],
};

const roleLabel = {
    admin: "مدیر کل",
    branch_manager: "مدیر شعبه",
    courier: "پیک",
};

const panelLabel = {
    admin: "پنل مدیریت کل",
    branch_manager: "پنل مدیریت شعبه",
    courier: "پنل پیک",
};

const initials = (name) => {
    if (!name) return "؟";
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

const PanelSidebar = () => {
    const user = useUserStore((state) => state.user);
    const clearUser = useUserStore((state) => state.clearUser);
    const clearCart = useCartStore((state) => state.clearCart);
    const pathname = usePathname();
    const router = useRouter();

    const groups = sidebarByRole[user?.role] || [];
    const branchName = user?.branch ? branchNamesDic[user.branch] : null;

    return (
        <aside className="bg-sidebar w-64 shrink-0 h-full flex flex-col">
            {/* Brand */}
            <div className="px-6 pt-6 pb-5 shrink-0">
                <Link href="/" className="inline-flex flex-col gap-1.5">
                    <img src="/images/logo-2.png" className="h-11 w-auto max-w-full" alt="ترخینه" />
                    <span className="text-sidebar-muted text-super-xs tracking-wide">{panelLabel[user?.role] || "پنل مدیریت"}</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
                {groups.map((group, gi) => (
                    <div key={gi}>
                        {group.section && (
                            <p className="text-sidebar-muted text-super-xs font-medium px-3 mb-2 tracking-wide">
                                {group.section}
                            </p>
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-super-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-sidebar-active text-sidebar-active-fg shadow-glow-brand"
                                                : "text-sidebar-muted hover:bg-sidebar-raised hover:text-sidebar-fg"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 shrink-0 fill-current ${isActive ? "" : "opacity-90"}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Identity footer */}
            <div className="shrink-0 border-t border-sidebar-border/10 p-3">
                <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-sidebar-active text-sidebar-active-fg flex items-center justify-center font-bold shrink-0">
                        {initials(user?.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sidebar-fg text-super-sm font-medium truncate">
                            {user?.fullName || user?.phoneNumber || "کاربر"}
                        </p>
                        <p className="text-sidebar-muted text-super-xs truncate">
                            {roleLabel[user?.role]}{branchName ? ` · شعبه ${branchName}` : ""}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => handleLogout(clearUser, clearCart, () => { }, router)}
                    className="mt-1 w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-super-sm font-medium text-sidebar-muted hover:bg-sidebar-raised hover:text-sidebar-fg transition-colors"
                >
                    <LogoutIcon className="w-5 h-5 shrink-0" />
                    <span>خروج از حساب</span>
                </button>
            </div>
        </aside>
    );
};

export default PanelSidebar;
