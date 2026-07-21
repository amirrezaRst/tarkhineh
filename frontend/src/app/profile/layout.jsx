"use client";

import Sidebar from "@/components/layout/profile/Sidebar";
import { usePathname } from "next/navigation";


const ProfileLayout = ({ children }) => {
    const pathname = usePathname();

    return (
        <>
            <div
                className="relative container xl:py-14 md:py-12 py-8 grid grid-cols-12 2xl:gap-8 lg:gap-5 gap-3"
            >

                <Sidebar />

                <section
                    className="min-h-[70vh] lg:col-span-9 md:col-span-10 col-span-full md:-order-1 -order-2 border border-border rounded-lg md:p-6 px-4 py-5"
                >

                    <h2 className="md:text-1.5xl text-xl text-foreground font-medium pb-3 border-b border-b-border/60">
                        {pathname === "/profile" ?
                            "پروفایل من" :
                            pathname === "/profile/orders" ?
                                "پیگیری سفارشات" :
                                pathname === "/profile/interests" ?
                                    "علاقمندی‌ها" :
                                    pathname === "/profile/address" ?
                                        "آدرس های من" : null
                        }

                    </h2>

                    <main className="pt-6 md:pb-16 pb-14">

                        {children}

                    </main>

                </section>

            </div>
        </>
    );
}

export default ProfileLayout;