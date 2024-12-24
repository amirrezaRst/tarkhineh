"use client"

import { ChevronIcon, XmarkIcon } from "@/assets/Icons";
import { useState } from "react";
import OtpField from "../OtpField";
import RegisterForm from "./RegisterForm";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import OtpForm from "./OtpForm";
import { useForm } from "react-hook-form";

const RegisterModal = ({ setIsOpen }) => {

    const [page, setPage] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <div
            className="bg-white rounded-lg w-[500px] py-8 px-7 text-center"
        >

            <div className="relative md:mb-7 mb-4">
                <img
                    src="/images/logo.png"
                    alt="رستوران های زنجیره ای ترخینه"
                    className="md:w-[130px] w-[120px] mx-auto"
                />
                <XmarkIcon
                    className="fill-[#717171] md:w-8 md:h-8 w-6 h-6 absolute left-0 top-0 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
                {
                    page === 1 && <ChevronIcon
                        className="fill-[#717171] md:w-8 md:h-8 w-6 h-6 absolute right-0 top-0 cursor-pointer -rotate-90"
                        onClick={() => setPage(0)}
                    />
                }
            </div>
            <h5 className="text-[#353535] text-xl mb-2.5">
                {page === 0 ? "ورود / ثبت نام" : "کد تایید"}
            </h5>
            <p className="text-[#717171] text-super-sm mb-2.5">
                {page === 0 ?
                    "با وارد کردن شماره موبایل کد تاییدی برای شما ارسال خواهد شد." :
                    `کد تایید پنج رقمی به شماره ${ConvertToPersianNumbers(phoneNumber)} ارسال شد.`
                }
            </p>


            {page === 0 ? <>
                <RegisterForm
                    setPage={setPage}
                    setIsOpen={setIsOpen}
                    setPhoneNumber={setPhoneNumber}
                />
            </> :
                <OtpForm
                    setPage={setPage}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    setIsOpen={setIsOpen}
                />
            }

        </div>
    );
}

export default RegisterModal;