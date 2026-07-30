import Sidebar from "@/components/layout/profile/Sidebar";
import ProfileHeading from "./ProfileHeading";

// Private, per-user account pages — nothing here is meaningful outside the
// logged-in owner's own session.
export const metadata = {
    title: "حساب کاربری",
    robots: { index: false, follow: false },
};

const ProfileLayout = ({ children }) => {
    return (
        <>
            <div
                className="relative container xl:py-14 md:py-12 py-8 grid grid-cols-12 2xl:gap-8 lg:gap-5 gap-3"
            >

                <Sidebar />

                <section
                    className="min-h-[70vh] lg:col-span-9 md:col-span-10 col-span-full md:-order-1 -order-2 border border-border rounded-lg md:p-6 px-4 py-5"
                >

                    <ProfileHeading />

                    <main className="pt-6 md:pb-16 pb-14">

                        {children}

                    </main>

                </section>

            </div>
        </>
    );
}

export default ProfileLayout;