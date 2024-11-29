import BenefitItem from "./BenefitItem";

const benefits = [
    "استفاده از برند شناخته شده ترخینه",
    "مشاوره در امور حقوقی، مالی و مالیاتی",
    "به حداقل رساندن ریسک سرمایه گذاری",
    "پشتیبانی بازاریابی و منابع انسانی",
    "تسریع روند بازگشت سرمایه",
    "دریافت مشاوره جهت تامین مواد اولیه و تجهیزات",
    "مشاوره های تخصصی جهت مدیریت رستوران",
    "طرح های تشویقی برای ارتقا فروش"
]


const BenefitsSection = () => {
    return (
        <section className="container md:py-20 py-16 border-b-2 border-[#CBCBCB]/30">
            <h2 className="xl:text-2.5xl md:text-2xl text-1.5xl text-[#353535] text-center md:font-semibold font-bold md:mb-10 mb-7">
                مزیت دریافت نمایندگی
            </h2>

            {/*//! Benefits List */}
            <div className="grid md:grid-cols-2 gap-x-3 md:gap-y-8 gap-y-4 2xl:px-52 xl:px-32 px-4">

                {benefits.map((item, index) =>
                    <BenefitItem key={index} text={item} />
                )}

            </div>

        </section>
    );
}

export default BenefitsSection;