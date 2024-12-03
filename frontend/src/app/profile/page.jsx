import {  PenIcon } from "@/assets/Icons";
import FormField from "@/components/FormField";

const ProfilePage = () => {
    return (
        <>

            <form action="" className="grid grid-cols-2 gap-x-4 gap-y-5">
                <FormField placeholder="نام" disabled />
                <FormField placeholder="نام خانوادگی" disabled />
                <FormField placeholder="آدرس ایمیل" type="email" disabled />
                <FormField placeholder="تلفن همراه" disabled />
                <FormField placeholder="تاریخ تولد (اختیاری)" disabled />
                <FormField placeholder="نام نمایشی" disabled />
            </form>
            <button
                className="flex items-center gap-2 py-2 px-7 border border-[#417F56] rounded-md text-[#417F56] mx-auto mt-6"
            >
                <PenIcon className="w-5 h-5 fill-[#417F56]" />
                ویرایش اطلاعات شخصی
            </button>

        </>
    );
}

export default ProfilePage;