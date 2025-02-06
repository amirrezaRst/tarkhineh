import { ClockIcon } from "@/assets/Icons";
import OtpField from "../OtpField";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import FormatTime from "@/utils/FormatTime";
import { handleRegister, handleSendOtp } from "@/services/UserService";
import useCartStore from "@/stores/useCartStore";

const OtpForm = ({ setPage, phoneNumber, setPhoneNumber, setIsOpen }) => {
    const [otp, setOtp] = useState();
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const fetchCart = useCartStore(state => state.fetchCart);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer]);

    const optHandler = async (e) => {
        e.preventDefault();
        handleSendOtp(otp, setOtp, phoneNumber, setLoading, setError, setPage, setIsOpen, fetchUser, fetchCart)
    };

    return (
        <form className="text-right" onSubmit={optHandler}>

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