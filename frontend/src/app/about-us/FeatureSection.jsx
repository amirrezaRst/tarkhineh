import { DiagramIcon, HomeWifiIcon, MenuBoardIcon, MenuIcon, UserIcon } from "@/assets/Icons";
import FeatureItem from "./FeatureItem";

const features = [
    {
        icon: <UserIcon className="md:w-14 md:h-14 w-12 h-12 fill-[#353535]" />,
        title: "پرسنلی مجرب و حرفه ای"
    },
    {
        icon: <DiagramIcon className="md:w-14 md:h-14 w-12 h-12 fill-[#353535]" />,
        title: "کیفیت بالای غذا"
    },
    {
        icon: <HomeWifiIcon className="md:w-14 md:h-14 w-12 h-12 fill-[#353535]" />,
        title: "محیطی دلنشین و آرام"
    },
    {
        icon: <MenuBoardIcon className="md:w-14 md:h-14 w-12 h-12 fill-[#353535]" />,
        title: "منوی متنوع"
    },
]

const FeatureSection = () => {
    return (
        <section className="bg-[#EDEDED] py-10">

            <div className="container grid lg:grid-cols-4 grid-cols-2 lg:gap-0 gap-x-4 gap-y-8">

                {features.map(({ icon, title }, index) =>
                    <FeatureItem key={index} icon={icon} title={title} />
                )}

            </div>

        </section>
    );
}

export default FeatureSection;