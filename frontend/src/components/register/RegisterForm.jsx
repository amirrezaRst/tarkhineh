import Link from "next/link";
import FormField from "../FormField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { handleRegister } from "@/services/UserService";

const RegisterForm = ({ setPage, setIsOpen, setPhoneNumber }) => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const [loading, setLoading] = useState(false);



    return (
        <form
            className="text-right"
            onSubmit={
                handleSubmit((data) => handleRegister(data, setPage, setPhoneNumber, setLoading, setError))
            }
        >

            <FormField
                placeholder="شماره موبایل"
                id="phone-number"
                type="tel"
                className="w-full mt-2 border-foreground text-foreground placeholder:text-foreground"
                register={register}
                validation={{
                    required: "شماره موبایل را وارد کنید.",
                    pattern: {
                        value: /^09\d{9}$/,
                        message: "شماره موبایل وارد شده صحیح نیست."
                    },
                    minLength: {
                        value: 11,
                        message: "شماره موبایل وارد شده باید 11 رقم باشد."
                    },
                    maxLength: {
                        value: 11,
                        message: "شماره موبایل وارد شده باید 11 رقم باشد."
                    },
                }}
                errors={errors}
            />

            <button
                className="bg-primary text-white leading-7 py-2 w-full rounded mt-5 mb-4 disabled:bg-muted"
                type="submit"
                disabled={loading}
            >
                ادامه
            </button>

            <p className="text-sm text-foreground">
                ورود و عضویت در ترخینه به منزله قبول <Link href="/rules" className="text-primary" onClick={() => setIsOpen(false)}>قوانین و مقررات</Link> است.
            </p>


        </form>
    );
}

export default RegisterForm;