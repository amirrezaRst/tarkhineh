"use client";

import { useEffect } from "react";
import PanelSidebar from "./PanelSidebar";
import useUserStore from "@/stores/useUserStore";

const PanelLayout = ({ children }) => {
    const user = useUserStore((state) => state.user);
    const fetchUser = useUserStore((state) => state.fetchUser);

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
            <div className="bg-background w-full h-screen flex items-center justify-center">
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

    return (
        <div className="bg-panel-ground flex w-full h-screen overflow-hidden" dir="rtl">
            <PanelSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top bar */}
                <header className="shrink-0 h-16 bg-surface border-b border-border/60 flex items-center justify-between px-8">
                    <p className="text-foreground font-semibold">
                        خوش آمدید{user.fullName ? `، ${user.fullName}` : ""}
                    </p>
                    <p className="text-muted-fg text-super-sm hidden sm:block">{today}</p>
                </header>

                {/*//! START MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto px-8 py-7">
                    {children}
                </main>
                {/*//? END MAIN CONTENT */}
            </div>
        </div>
    );
}

export default PanelLayout;
