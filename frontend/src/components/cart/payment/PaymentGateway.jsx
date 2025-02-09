import { PersonalWalletIcon, WarningIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";

const PaymentGateway = () => {
    const { paymentMethod, paymentGateway: selectedGateway, setPaymentGateway } = useCartStore();
    const gateways = ["melat", "saman", "parsian"];

    if (paymentMethod == "cash") return (
        <div
            className="flex md:flex-row flex-col md:items-center xl:gap-8 gap-4 border border-[#CBCBCB] rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-4"
        >

            <div className="flex items-center gap-2 md:border-b-0 border-b border-b-[#CBCBCB] md:pb-0 pb-4 md:mb-0 mb-1">
                <WarningIcon className="fill-[#353535] md:w-7 md:h-7" />
                <p className="lg:text-lg md:text-base text-super-sm text-[#353535]">
                    قابل توجه
                </p>
            </div>
            <p className="flex-1 xl:text-super-sm md:text-sm text-xs md:leading-6 leading-5 text-[#717171]">
                هزینه سفارش شما در حین تحویل کالا دریافت خواهد شد. لطفا قبل از تحویل کالا کارت بانکی یا پول نقد همراه خود
                داشته باشید و از درخواست برای پرداخت در زمان بعدی یا نسیه خودداری فرمایید. با تشکر از همراهی شما.
            </p>

        </div>
    )

    return (
        <div className="border border-[#CBCBCB] rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-4">
            <div className="flex items-center gap-1.5 md:border-b-0 border-b border-b-[#CBCBCB] md:pb-0 pb-4 md:mb-0 mb-1">
                <PersonalWalletIcon className="md:w-7 md:h-7 fill-[#353535]" />
                <p className="text-[#353535] lg:text-lg md:text-base text-super-sm">درگاه پرداخت</p>
            </div>
            <div className="w-4/5 mx-auto mt-5 flex justify-center xl:gap-7 gap-5 mb-4">
                {gateways.map((gateway, index) => (
                    <div
                        key={index}
                        className={`xl:w-28 xl:h-28 md:w-20 md:h-20 w-16 h-16 rounded-md overflow-hidden border ring-1 cursor-pointer duration-300 hover:shadow-lg ${selectedGateway === gateway
                            ? "border-[#417F56] ring-[#417F56]"
                            : "border-[#CBCBCB] ring-[#CBCBCB] grayscale"
                            }`}
                        onClick={() => setPaymentGateway(gateway)}
                    >
                        <img src={`/images/${gateway}-gateway.jpg`} alt={gateway} className="w-full h-full" />
                    </div>
                ))}
            </div>
            <p className="md:text-sm text-[10px] text-[#717171] text-center">
                پرداخت از طریق کلیه کارت‌های عضو شتاب امکان‌پذیر است.‌ <br />
            </p>
            <p className="md:text-super-xs text-[10px] text-[#717171] text-center mt-1">
                (لطفا قبل از پرداخت فیلترشکن خود را خاموش کنید.)
            </p>
        </div>
    );
};

export default PaymentGateway;