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
            <h2 className="md:text-3xl text-1.5xl font-semibold text-center md:mb-8 mb-5">
                شعبه {branches.find(b => b.branch === branch).name}
            </h2>
            <div
                className="relative w-full xl:h-[450px] lg:h-[420px] md:h-[380px] h-[280px]"
            >
                <img
                    src={`/images/restaurant-branch-${branch}.jpg`}
                    alt={`شعبه ${branches.find(b => b.branch === branch).name} ترخینه`}
                    className="h-full w-full object-cover object-center"
                />
                <div
                    className="xl:w-[800px] w-[90%] bg-white absolute md:bottom-[-100px] bottom-[-50px] right-[50%] translate-x-[50%] md:border-[3px] border border-[#417F56] rounded-lg grid grid-cols-3 md:gap-8 gap-4 lg:py-11 lg:px-8 md:py-7 md:px-6 px-2.5 py-4"
                >

                    <ContactInfo
                        icon={<PhoneIcon className="md:w-8 md:h-8 w-6 h-6 fill-[#353535]" />}
                        title="تماس"
                        content={branches.find(b => b.branch === branch).phone}
                    />
                    <ContactInfo
                        icon={<LocationIcon className="md:w-8 md:h-8 w-6 h-6 fill-[#353535]" />}
                        title="آدرس"
                        content={[branches.find(b => b.branch === branch).address]}
                    />
                    <ContactInfo
                        icon={<ClockIcon className="md:w-8 md:h-8 w-6 h-6 fill-[#353535]" />}
                        title="ساعات کاری"
                        content={[branches.find(b => b.branch === branch).hours]}
                    />

                </div>
            </div>
        </section>
    );
};

const ContactInfo = ({ icon, title, content }) => (
    <div className="flex flex-col items-center justify-start md:gap-4 gap-2.5">
        {icon}
        <div className="flex flex-col gap-2.5 text-[#353535] md:text-base text-xs text-center">
            {content.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    </div>
);

export default AboutBranchSection;
