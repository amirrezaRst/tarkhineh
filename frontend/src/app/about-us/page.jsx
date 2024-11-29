import HeaderBanner from "@/components/HeaderBanner";
import FeatureSection from "./FeatureSection";
import Description from "./Description";
import Image from "./Image";

const AboutUsPage = () => {
    return (
        <>

            <HeaderBanner imageSrc="/images/about-background-hero2.jpg" title="درباره ترخینه بیشتر بدانید!" />

            <section className="container md:py-20 py-16">

                <h2 className="text-2xl text-[#353535] mb-6">
                    درباره ما
                </h2>

                <div className="grid xl:grid-cols-2 lg:grid-cols-12 2xl:gap-14 gap-5">

                    <Description />

                    <Image />

                </div>

            </section>

            <FeatureSection />


        </>
    );
}

export default AboutUsPage;