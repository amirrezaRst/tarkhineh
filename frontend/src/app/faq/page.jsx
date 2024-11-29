import TopNavigation from "@/components/TopNavigation";
import HeaderBanner from "@/components/HeaderBanner";
import AccordionList from "@/components/AccordionList";
import { FaqList } from "@/constant/faqList";

const RulesPage = () => {
    return (
        <>

            {/*//! Header Banner */}
            <HeaderBanner title={"سوالات متداول از ترخینه"} imageSrc={"/images/faq-background-hero.jpg"} />

            {/*//! TopNavigation */}
            <TopNavigation />


            {/*//! Items List */}
            <AccordionList lists={FaqList} />

        </>
    );
}

export default RulesPage;