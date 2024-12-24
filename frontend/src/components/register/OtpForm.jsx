import { ClockIcon } from "@/assets/Icons";
import OtpField from "../OtpField";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "@/stores/useUserStore";
import FormatTime from "@/utils/FormatTime";
import { handleRegister } from "@/services/UserService";

const OtpForm = ({ setPage, phoneNumber, setPhoneNumber, setIsOpen }) => {
    const [otp, setOtp] = useState();
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const fetchUser = useUserStore((state) => state.fetchUser);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer]);


    const handleSendOtp = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (!otp) {
            return setError({ message: "کد تایید را وارد کنید." });
        }
        if (otp.toString().length != 5) {
            return setError({ message: "کد تایید باید 5 رقم باشد." });
        }
        if (typeof parseInt(otp, 10) == 'string') {
            return setError({ message: "کد تایید باید عدد باشد." });
        }
        if (isNaN(otp)) {
            return setError({ message: "کد تایید باید عدد باشد." });
        }
        setError({});


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verifyOtp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber,
                otpCode: otp.toString(),
            }),
            credentials: 'include'
        }).then(response => response.json());

        const { status, message } = response;

        switch (status) {
            case 200:
                fetchUser();
                setIsOpen(false);
                toast.success("شما با موفقیت وارد شدید.");
                break;
            case 403:
                setError({ message: "کد تایید نامعتبر یا منقضی شده است." });
                break;
            case 404:
                setError({ message: "کاربری با این شماره تلفن یافت نشد." });
                break;
            default:
                toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
                break;
        }
        setLoading(false);
    };


    return (
        <form className="text-right" onSubmit={handleSendOtp}>

            <OtpField value={otp} setValue={setOtp} error={error} />

            <div className="flex items-center justify-between mt-3">
                <div className="text-[#717171] text-super-sm">
                    {timer > 0 ?
                        <p>
                            <ClockIcon className="fill-[#717171] w-5 h-5 inline" /> {ConvertToPersianNumbers(FormatTime(timer))} تا دریافت مجدد کد
                        </p> :
                        <p
                            className="cursor-pointer"
                            onClick={() => {
                                setTimer(120);
                                handleRegister({ "phone-number": phoneNumber }, setPage, setPhoneNumber, setLoading, setError)
                            }}
                        >
                            ارسال کد مجدد
                        </p>
                    }
                </div>
                <p
                    className="text-[#417F56] cursor-pointer"
                    onClick={() => setPage(0)}
                >ویرایش شماره</p>
            </div>

            <button
                className="bg-[#417F56] text-white leading-7 py-2 w-full rounded mt-5 disabled:bg-[#BDBDBD]"
                type="submit"
                disabled={loading}
            >
                ثبت کد
            </button>
        </form>
    );
}

export default OtpForm;