import TopNavigation from "@/components/TopNavigation";
import HeaderBanner from "@/components/HeaderBanner";
import AccordionList from "@/components/AccordionList";
import { PrivacyList } from "@/constant/privacyList";

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