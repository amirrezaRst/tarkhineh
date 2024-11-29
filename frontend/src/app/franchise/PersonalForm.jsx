import FormField from "@/components/FormField";

const PersonalForm = () => {
    return (
        <>
            <p className="lg:text-xl md:text-lg md:font-normal font-medium text-[#353535] md:mb-4 mb-6">
                مشخصات فردی متقاضی
            </p>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-y-1 md:gap-y-5 gap-y-3.5 mb-12">

                <FormField placeholder="نام و نام خانوادگی" />
                <FormField placeholder="شماره تماس" />
                <FormField type="email" placeholder="ایمیل!" />

            </div>
        </>
    );
}

export default PersonalForm;