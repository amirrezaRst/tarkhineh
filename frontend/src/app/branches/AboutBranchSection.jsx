import { ClockIcon, LocationIcon, PhoneIcon } from "@/assets/Icons";

const AboutBranchSection = ({ info }) => {

    return (
        <section className="md:py-20 py-12">
            <h2 className="md:text-3xl text-1.5xl font-semibold text-center md:mb-8 mb-5">
                شعبه {info.name}
            </h2>
            <div
                className="relative w-full xl:h-[450px] lg:h-[420px] md:h-[380px] h-[280px]"
            >
                <img
                    src={info.images[0]}
                    alt={`شعبه ${info.name} ترخینه`}
                    className="h-full w-full object-cover object-center"
                />
                <div
                    className="xl:w-[800px] w-[90%] bg-white absolute md:bottom-[-100px] bottom-[-50px] right-[50%] translate-x-[50%] md:border-[3px] border border-primary rounded-lg grid grid-cols-3 md:gap-8 gap-4 lg:py-11 lg:px-8 md:py-7 md:px-6 px-2.5 py-4"
                >

                    <ContactInfo
                        icon={<PhoneIcon className="md:w-8 md:h-8 w-6 h-6 fill-foreground" />}
                        title="تماس"
                        content={[info.phone]}
                    />
                    <ContactInfo
                        icon={<LocationIcon className="md:w-8 md:h-8 w-6 h-6 fill-foreground" />}
                        title="آدرس"
                        content={[info.address]}
                    />
                    <ContactInfo
                        icon={<ClockIcon className="md:w-8 md:h-8 w-6 h-6 fill-foreground" />}
                        title="ساعات کاری"
                        content={[info.hoursLabel, info.isOpen === null ? null : (info.isOpen ? "هم‌اکنون باز است" : "هم‌اکنون بسته است")].filter(Boolean)}
                    />

                </div>
            </div>
        </section>
    );
};

const ContactInfo = ({ icon, title, content }) => (
    <div className="flex flex-col items-center justify-start md:gap-4 gap-2.5">
        {icon}
        <div className="flex flex-col gap-2.5 text-foreground md:text-base text-xs text-center">
            {content.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    </div>
);

export default AboutBranchSection;
