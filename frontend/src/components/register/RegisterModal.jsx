"use client"

import Image from "next/image";
import { ChevronIcon, XmarkIcon } from "@/assets/Icons";
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import OtpForm from "./OtpForm";

const RegisterModal = ({ setIsOpen }) => {

    const [page, setPage] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');
    // Only ever set when the backend's DEMO_MODE is on — see
    // userController.registerUser. No real SMS provider is wired up (this
    // is a portfolio project), so the code is shown here instead.
    const [demoOtpCode, setDemoOtpCode] = useState(null);

    return (
        <div
            className="bg-white rounded-lg w-[500px] py-8 px-7 text-center"
        >

            <div className="relative md:mb-7 mb-4">
                <Image
                    src="/images/logo.png"
                    alt="رستوران های زنجیره ای ترخینه"
                    width={310}
                    height={102}
                    className="md:w-[130px] w-[120px] mx-auto h-auto"
                />
                <XmarkIcon
                    className="fill-muted-fg md:w-8 md:h-8 w-6 h-6 absolute left-0 top-0 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
                {
                    page === 1 && <ChevronIcon
                        className="fill-muted-fg md:w-8 md:h-8 w-6 h-6 absolute right-0 top-0 cursor-pointer -rotate-90"
                        onClick={() => setPage(0)}
                    />
                }
            </div>
            <h5 className="text-foreground text-xl mb-2.5">
                {page === 0 ? "ورود / ثبت نام" : "کد تایید"}
            </h5>
            <p className="text-muted-fg text-super-sm mb-2.5">
                {page === 0 ?
                    "با وارد کردن شماره موبایل کد تاییدی برای شما ارسال خواهد شد." :
                    `کد تایید پنج رقمی به شماره ${ConvertToPersianNumbers(phoneNumber)} ارسال شد.`
                }
            </p>


            {page === 1 && demoOtpCode &&
                <div className="text-right bg-primary-subtle border border-primary/30 rounded-lg px-4 py-3 mb-4">
                    <p className="text-primary text-super-sm font-medium mb-0.5">حالت دمو — بدون پیامک واقعی</p>
                    <p className="text-foreground text-sm">
                        کد تایید شما: <span className="font-bold tracking-widest">{ConvertToPersianNumbers(demoOtpCode)}</span>
                    </p>
                </div>
            }

            {page === 0 ? <>
                <RegisterForm
                    setPage={setPage}
                    setIsOpen={setIsOpen}
                    setPhoneNumber={setPhoneNumber}
                    setDemoOtpCode={setDemoOtpCode}
                />
            </> :
                <OtpForm
                    setPage={setPage}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    setIsOpen={setIsOpen}
                    setDemoOtpCode={setDemoOtpCode}
                />
            }

        </div>
    );
}

export default RegisterModal;