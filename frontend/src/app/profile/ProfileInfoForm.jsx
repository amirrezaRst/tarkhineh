import FormField from "@/components/FormField";
import useUserStore from "@/stores/useUserStore";
import { useForm } from "react-hook-form";

const ProfileInfoForm = ({ isEdit, register, errors }) => {

    return (
        <div
            className="grid md:grid-cols-2 gap-x-4 md:gap-y-5 gap-y-4"
        // onSubmit={handleSubmit((data) => handler(data, setError))}
        >

            <FormField
                placeholder="نام و نام خانوادگی"
                id="fullName"
                disabled={!isEdit}
                register={register}
                className="disabled:text-[#CCCCCC] disabled:placeholder:text-[#CCCCCC]"
                validation={{
                    required: "وارد کردن نام و نام خانوادگی الزامی است.",
                    minLength: {
                        value: 6,
                        message: "نام و نام خانوادگی باید حداقل 6 کاراکتر باشد.",
                    },
                    maxLength: {
                        value: 50,
                        message: "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.",
                    },
                }}
                errors={errors}
            />

            <FormField
                placeholder="آدرس ایمیل"
                id="email"
                type="email"
                disabled={!isEdit}
                register={register}
                className="disabled:text-[#CCCCCC] disabled:placeholder:text-[#CCCCCC]"
                validation={{
                    // required: "وارد کردن ایمیل الزامی است.",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "آدرس ایمیل وارد شده معتبر نیست.",
                    },
                }}
                errors={errors}
            />

            <FormField
                placeholder="تلفن همراه"
                id="phone"
                disabled={true}
                register={register}
                className="disabled:text-[#CCCCCC] disabled:placeholder:text-[#CCCCCC]"
                validation={{
                    // required: "وارد کردن شماره موبایل الزامی است.",
                    pattern: {
                        value: /^09\d{9}$/,
                        message: "شماره موبایل وارد شده صحیح نیست.",
                    },
                    minLength: {
                        value: 11,
                        message: "شماره موبایل باید ۱۱ رقم باشد.",
                    },
                    maxLength: {
                        value: 11,
                        message: "شماره موبایل باید ۱۱ رقم باشد.",
                    },
                }}
                errors={errors}
            />

            <FormField
                placeholder="نام نمایشی"
                id="userName"
                disabled={!isEdit}
                register={register}
                className="disabled:text-[#CCCCCC] disabled:placeholder:text-[#CCCCCC]"
                validation={{
                    // required: "وارد کردن نام نمایشی الزامی است.",
                    minLength: {
                        value: 2,
                        message: "نام نمایشی باید حداقل ۲ کاراکتر باشد.",
                    },
                    maxLength: {
                        value: 30,
                        message: "نام نمایشی نمی‌تواند بیشتر از ۳۰ کاراکتر باشد.",
                    },
                }}
                errors={errors}
            />


        </div>
    );
}

export default ProfileInfoForm;