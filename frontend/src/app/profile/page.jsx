import { PenIcon } from "@/assets/Icons";
import FormField from "@/components/FormField";

const ProfilePage = () => {

    return (
        <div className="xl:px-12 lg:px-8 px-2">

            <form action="" className="grid md:grid-cols-2 gap-x-4 md:gap-y-5 gap-y-4">
                <FormField placeholder="نام" />
                <FormField placeholder="نام خانوادگی" />
                <FormField placeholder="آدرس ایمیل" type="email" />
                <FormField placeholder="تلفن همراه" />
                <FormField placeholder="تاریخ تولد (اختیاری)" />
                <FormField placeholder="نام نمایشی" />
            </form>
            <button
                className="md:w-fit w-full flex items-center justify-center gap-2 md:py-2 py-2.5 px-7 border border-[#417F56] rounded-md text-[#417F56] lg:text-base text-super-sm mx-auto md:mt-6 mt-8"
            >
                <PenIcon className="w-5 h-5 fill-[#417F56]" />
                ویرایش اطلاعات شخصی
            </button>

        </div>
    );
}

export default ProfilePage;