import TopNavigation from "@/components/TopNavigation";
import HeaderBanner from "@/components/HeaderBanner";
import AccordionList from "@/components/AccordionList";
import { PrivacyList } from "@/constant/privacyList";

export const metadata = {
    title: "حریم شخصی کاربران",
    description: "سیاست حریم خصوصی ترخینه: نحوه‌ی گردآوری، استفاده و محافظت از اطلاعات کاربران.",
};

const RulesPage = () => {
    return (
        <>

            {/*//! Header Banner */}
            <HeaderBanner title={"حریم شخصی کاربران"} imageSrc={"/images/privacy-background-hero.jpg"} />

            {/*//! TopNavigation */}
            <TopNavigation />

            {/*//! Items List */}
            <AccordionList lists={PrivacyList} />

        </>
    );
}

export default RulesPage;