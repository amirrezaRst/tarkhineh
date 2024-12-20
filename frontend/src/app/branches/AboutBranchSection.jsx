// AboutBranchSection.tsx
import { ClockIcon, LocationIcon, PhoneIcon } from "@/assets/Icons";

const branches = [
    {
        branch: "aghdasiyeh",
        name: "اقدسیه",
        address: "خیابان اقدسیه ، نرسیده به میدان خیام، پلاک ۸",
        phone: ["۰۲۱-۵۴۸۹۱۲۵۲۵۳"],
        hours: "همه‌روزه از ساعت ۱۲ الی ۲۳",
        image: "/images/restaurant-branch-aghdasiyeh.jpg",
    },
    {
        branch: "tehranpars",
        name: "تهرانپارس",
        address: "تهران پارس، فلکه سوم، پاساژ سیوان",
        phone: ["۰۲۱-۵۴۸۹۱۲۵۰۵۱"],
        hours: "همه‌روزه از ساعت ۱۲ الی ۲۳",
        image: "/images/restaurant-branch-tehranpars.jpg",
    },
    {
        branch: "chalous",
        name: "چالوس",
        address: "چالوس، خیابان ۱۷ شهریور، بعد کوچه کوروش، جنب داروخانه دکتر میلانی",
        phone: ["۰۲۱-۵۴۸۹۱۲۵۲۵۳"],
        hours: "همه‌روزه از ساعت ۱۲ الی ۲۳",
        image: "/images/restaurant-branch-chalous.jpg",
    },
    {
        branch: "vanak",
        name: "ونک",
        address: "میدان ونک، خیابان فردوسی، نبش کوچه نیلوفر، پلاک ۲۶",
        phone: ["۰۲۱-۵۴۸۹۱۲۵۶۵۷"],
        hours: "همه‌روزه از ساعت ۱۲ الی ۲۳",
        image: "/images/restaurant-branch-vanak.jpg",
    },
]

const AboutBranchSection = ({ branch }) => {

    return (
        <section className="md:py-20 py-12">
            <h2 className="md:text-3xl text-2.5xl font-semibold text-center mb-8">
                شعبه {branches.find(b => b.branch === branch).name}
            </h2>
            <div
                className={`relative w-full h-[400px] bg-[url('/images/restaurant-branch-${branch}.jpg')] bg-center bg-cover`}
            >
                <div className="w-[800px] bg-white absolute bottom-[-100px] right-[50%] translate-x-[50%] border-[3px] border-[#417F56] rounded-lg grid grid-cols-3 gap-8 py-11 px-8">

                    <ContactInfo icon={<PhoneIcon className="w-8 h-8 fill-[#353535]" />} title="تماس" content={branches.find(b => b.branch === branch).phone} />
                    <ContactInfo icon={<LocationIcon className="w-8 h-8 fill-[#353535]" />} title="آدرس" content={[branches.find(b => b.branch === branch).address]} />
                    <ContactInfo icon={<ClockIcon className="w-8 h-8 fill-[#353535]" />} title="ساعات کاری" content={[branches.find(b => b.branch === branch).hours]} />

                </div>
            </div>
        </section>
    );
};

const ContactInfo = ({ icon, title, content }) => (
    <div className="flex flex-col items-center justify-start gap-4">
        {icon}
        <div className="flex flex-col gap-2.5 text-[#353535] text-center">
            {content.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    </div>
);

export default AboutBranchSection;
