import { DiagramIcon, HomeWifiIcon, UserIcon, MenuBoardIcon } from "@/assets/Icons";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutSection = () => (
  <section className="w-full bg-[url('/images/about-background-hero.jpg')] bg-cover bg-center md:py-20 py-12">
    <div className="container grid md:grid-cols-2 xl:gap-10 lg:gap-20 md:gap-10 gap-16">

      <AboutSectionInfo />

      <div className="flex flex-col justify-center lg:gap-20 gap-10">
        <div className="flex items-center justify-center lg:gap-20 gap-10">
          {[{ text: "پرسنلی مجرب و حرفه ای", Icon: UserIcon }, { text: "کیفیت بالای غذاها", Icon: DiagramIcon }].map(({ text, Icon }, index) => (
            <div key={index} className="flex flex-col items-center">
              <Icon className="xl:w-10 xl:h-10 w-9 h-9 fill-white" />
              <span className="text-white xl:text-base lg:text-super-sm text-sm text-center mt-3">{text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center lg:gap-20 gap-10">
          {[{ text: "محیطی دلنشین و آرام", Icon: HomeWifiIcon }, { text: "منوی متنوع", Icon: MenuBoardIcon }].map(({ text, Icon }, index) => (
            <div key={index} className="flex flex-col items-center">
              <Icon className="xl:w-10 xl:h-10 w-9 h-9 fill-white" />
              <span className="text-white xl:text-base lg:text-super-sm text-sm text-center mt-3">{text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default AboutSection;
