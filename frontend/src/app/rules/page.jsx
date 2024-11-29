import TopNavigation from "@/components/TopNavigation";
import HeaderBanner from "@/components/HeaderBanner";
import AccordionList from "@/components/AccordionList";
import { RulesList } from "@/constant/rulesList";


const RulesPage = () => {
    return (
        <>

            {/*//! Header Banner */}
            <HeaderBanner title={"قوانین ترخینه"} imageSrc={"/images/rules-background-hero.jpg"} />

            {/*//! TopNavigation */}
            <TopNavigation />

            {/*//! Items List */}
            <AccordionList lists={RulesList} />

        </>
    );
}

export default RulesPage;