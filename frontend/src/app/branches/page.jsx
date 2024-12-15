import { ClockIcon, HeartIcon, LocationIcon, PhoneIcon, StarIcon } from "@/assets/Icons";
import SelectBranchSection from "./SelectBranchSection";
import MenuCard from "@/components/branchesPage/MenuCard";
import MenuSection from "./MenuSection";
import AboutBranchSection from "./AboutBranchSection";
import CommentCard from "@/components/branchesPage/CommentCard";

const BranchesPage = () => {

    return (
        <main>

            {/*//! Select Branch Section */}
            <SelectBranchSection />


            {/*//! Branch Foods Section */}
            <MenuSection title="غذاهای شعبه اقدسیه" items={["1", "2", "3"]} />

            {/*//! Popular Foods Section */}
            <MenuSection title="غذاهای محبوب شعبه اقدسیه" items={["1", "2", "3"]} bgColor="green" />



            {/*//! Branch Appetizers Section */}
            <MenuSection title="پیش غذاهای شعبه اقدسیه" items={["1", "2", "3"]} />

            {/*//! Popular Appetizers Section */}
            <MenuSection title="پیش غذاهای محبوب شعبه اقدسیه" items={["1", "2", "3"]} bgColor="green" />



            {/*//! Branch Appetizers Section */}
            <MenuSection title="دسرهای شعبه اقدسیه" items={["1", "2", "3"]} />

            {/*//! Popular Appetizers Section */}
            <MenuSection title="دسرهای محبوب شعبه اقدسیه" items={["1", "2", "3"]} bgColor="green" />



            {/*//! About Branch Section */}
            <AboutBranchSection />


            {/*//! START User Comments Section */}
            <section
                className={`container md:py-20 py-12 mt-10 mb-5`}
            >
                <h2 className="md:text-3xl text-2.5xl font-semibold text-center mb-8">نظرات کاربران</h2>

                {/*//! Comments List */}
                <div className="flex gap-8 overflow-x-auto pb-2">

                    {
                        [{ fullName: "آرزو محمدعلیزاده", profile: "/images/profile-1.jpg" },
                        { fullName: "سردار وظیفه", profile: "/images/profile-2.jpg" },
                        { fullName: "علی عسگری", profile: "/images/profile-3.jpg" }].map((item, index) =>
                            <CommentCard key={index} {...item} />
                        )
                    }

                </div>

            </section>
            {/*//? END User Comments Section */}



        </main >
    );
}

export default BranchesPage;