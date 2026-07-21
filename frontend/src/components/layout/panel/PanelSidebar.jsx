"use client";

import { DashboardIcon, DeliveryIcon, DiagramIcon, FastFoodIcon, FastFoodMenuIcon, HistoryIcon } from "@/assets/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";


const sidebarItemsByRole = {
    admin: [
        { label: "داشبورد", href: "/admin", icon: DashboardIcon },
        { label: "مدیریت رستوران‌ها", href: "/admin/restaurants", icon: FastFoodIcon },
        { label: "گزارشات کلی", href: "/admin/reports", icon: DiagramIcon },
    ],
    branch_manager: [
        { label: "داشبورد", href: "/panel/branch", icon: DashboardIcon },
        { label: "منو رستوران", href: "/panel/branch/menu", icon: FastFoodMenuIcon },
        { label: "پیک‌ها", href: "/panel/branch/couriers", icon: DeliveryIcon },
        { label: "سفارش‌ها", href: "/panel/branch/orders", icon: FastFoodIcon },
        { label: "گزارشات", href: "/panel/branch/reports", icon: DiagramIcon },
    ],
    courier: [
        { label: "داشبورد", href: "/panel/courier", icon: DashboardIcon },
        { label: "سفارش‌های من", href: "/panel/courier/orders", icon: DeliveryIcon },
        { label: "تاریخچه تحویل", href: "/panel/courier/history", icon: HistoryIcon },
        { label: "وضعیت فعالیت", href: "/panel/courier/status", icon: DeliveryIcon },
    ]
};

const PanelSidebar = () => {
    const role = "branch_manager"; //! This should be dynamically set based on the logged-in user's role
    const sidebarItems = sidebarItemsByRole[role] || sidebarItemsByRole.branch_manager; //! Default to branch_manager if role is not found
    const pathname = usePathname();


    return (
        <aside className="bg-white max-w-64 z-990 inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent">
            <div className="h-19.5">
                <i className="absolute top-0 right-0 hidden p-4 opacity-50 cursor-pointer fas fa-times text-slate-400 xl:hidden" ></i>
                <Link href="/" className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" >
                    <img src="/images/logo.png" className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-12" alt="main_logo" />
                </Link>
            </div>

            <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

            <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full pt-4">
                <ul className="flex flex-col pl-0 gap-3 mb-0">


                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={index} className="mt-0.5 w-full">
                                <Link
                                    href={item.href}
                                    className={`py-2.5 my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold transition-colors ${isActive ? "bg-white shadow-md text-primary" : "text-muted-fg"
                                        }`}
                                >
                                    <div className={`mr-2 flex h-10 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5 ${isActive
                                        ? "bg-gradient-to-tl from-green-700 to-lime-500 shadow-soft-2xl"
                                        : "bg-white"
                                        }`}>
                                        <Icon className={`${isActive ? "fill-white stroke-white" : "fill-muted-fg"} w-7 h-7`} />
                                    </div>
                                    <span className="mr-1.5 duration-300 opacity-100 pointer-events-none ease-soft">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}


                </ul>
            </div>

        </aside>
    );
}

export default PanelSidebar;