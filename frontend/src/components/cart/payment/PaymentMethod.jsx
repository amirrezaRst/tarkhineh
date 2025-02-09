import useCartStore from "@/stores/useCartStore";
import RadioGroup from "../RadioGroup";
import { PersonalWallet2Icon, PersonalWalletIcon, WalletMoneyIcon } from "@/assets/Icons";

const PaymentMethod = () => {
    const { paymentMethod, setPaymentMethod } = useCartStore();
    const options = [
        { id: "online-payment", value: "online", label: "پرداخت اینترنتی", description: "توسط درگاه پرداخت بانکی", icon: PersonalWallet2Icon },
        { id: "cash-payment", value: "cash", label: "پرداخت در محل", description: "پرداخت به صورت حضوری", icon: PersonalWalletIcon },
    ];

    return (
        <RadioGroup
            title="روش پرداخت"
            name="payment-method"
            options={options}
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
            headerIcon={WalletMoneyIcon}
        />
    );
};

export default PaymentMethod;