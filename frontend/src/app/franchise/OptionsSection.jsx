import { BankIcon, BookIcon, ChartIcon, WalletIcon } from "@/assets/Icons";
import OptionItem from "./OptionItem";

const options = [
    {
        title: "بیش از 20 شعبه فعال در سراسر کشور",
        icon: <BankIcon />
    },
    {
        title: "تسهیلات راه‌اندازی رستوران و تجهیز آن",
        icon: <WalletIcon />
    },
    {
        title: "طرح‌های تشویقی ارتقای فروش",
        icon: <ChartIcon />
    },
    {
        title: "اعطای دستورالعمل پخت غذاهاF",
        icon: <BookIcon />
    },
]

const OptionsSection = () => {
    return (
        <section className="container md:py-20 py-12 border-b-2 border-[#CBCBCB]/30 grid md:grid-cols-4 grid-cols-2 gap-6">

            {options.map(({ icon, title }, index) =>
                <OptionItem key={index} icon={icon} title={title} />
            )}

        </section>
    );
}

export default OptionsSection;