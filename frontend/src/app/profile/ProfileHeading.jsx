"use client";

import { usePathname } from "next/navigation";

const ProfileHeading = () => {
    const pathname = usePathname();

    return (
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
    );
};

export default ProfileHeading;
