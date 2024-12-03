"use client";

import Sidebar from "@/components/layout/profile/Sidebar";
import { usePathname } from "next/navigation";


const ProfileLayout = ({ children }) => {
    const pathname = usePathname();

    return (
        <>
            <div
                className="container md:py-20 py-16 grid grid-cols-12 gap-8"
            >

                {/*//! Sidebar */}
                <Sidebar />

                <section
                    className="min-h-[70vh] col-span-9 border border-[#CBCBCB] rounded-lg p-6"
                >

                    <h2 className="text-1.5xl text-[#353535] font-medium pb-3 border-b border-b-[#CBCBCB]">
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

                    <div className="px-12 pt-10 pb-16">

                        {children}

                    </div>

                </section>

            </div>
        </>
    );
}

export default ProfileLayout;