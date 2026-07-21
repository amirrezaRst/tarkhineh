import HeaderBanner from "@/components/HeaderBanner";
import OptionsSection from "./OptionsSection";
import BenefitsSection from "./BenefitsSection";
import ConsultationSection from "./CunsultationSection";
import FeatureForm from "./FeatureForm";
import DetailForm from "./DetailForm";
import AddressForm from "./AddressForm";
import PersonalForm from "./PersonalForm";

const FranchisePage = () => {
    return (
        <>

            <HeaderBanner title="همین الان به خانواده بزرگ ترخینه بپیوندید!" imageSrc="/images/franchise-background-hero.jpg" />

            {/*//! Options Section */}
            <OptionsSection />


            {/*//! Benefits Section */}
            <BenefitsSection />

            {/*//! Consultation Section */}
            <ConsultationSection />

            {/*//! Agency Section */}
            <section className="container xl:my-24 py-14 border border-border/40 rounded-lg">

                <h2 className="xl:text-2.5xl md:text-2xl text-1.5xl text-foreground text-center md:font-semibold font-bold md:mb-12 mb-10">
                    فرم درخواست نمایندگی
                </h2>

                <form action="">

                    <PersonalForm />

                    <AddressForm />

                    <DetailForm />

                    <FeatureForm />

                    <button className="bg-primary text-white text-super-sm block mx-auto rounded-md py-3 px-14 mt-7">
                        ثبت اطلاعات
                    </button>

                </form>

            </section>


        </>
    );
}

export default FranchisePage;