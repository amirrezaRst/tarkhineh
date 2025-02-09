import { CirclePlusIcon, LocationIcon } from "@/assets/Icons";
import { useState, useEffect } from "react";
import useUserStore from "@/stores/useUserStore";
import useCartStore from "@/stores/useCartStore";
import AddressPage from "@/app/profile/address/page";
import NewAddressModal from "@/app/profile/address/NewAddressModal";

const DeliveryAddress = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore(state => state.user);
    const { deliveryType, selectedAddress, setSelectedAddress } = useCartStore();

    useEffect(() => {
        if (user?.addresses && user?.addresses?.length > 0) {
            setSelectedAddress(0);
        }
    }, [user?.addresses, setSelectedAddress]);
    if (deliveryType == "courier") return (
        <div className="border border-[#CBCBCB] rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-4">
            <div className="flex items-center justify-between border-b border-b-[#CBCBCB] pb-3.5 mb-7">
                <div className="flex items-center gap-1">
                    <LocationIcon className="w-5 h-5 fill-[#353535]" />
                    <p className="md:text-lg text-super-base text-[#353535]">آدرس ها</p>
                </div>

                <div className="flex items-center gap-0.5 cursor-pointer" onClick={() => setIsOpen(true)}>
                    <CirclePlusIcon className="w-6 h-6" />
                    <p className="md:text-base text-super-sm text-[#417F56]">افزودن آدرس</p>
                </div>
            </div>

            <AddressPage cartPage={true} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
            <NewAddressModal isOpen={isOpen} setIsOpen={setIsOpen} userId={user?._id} />
        </div>
    );
}

export default DeliveryAddress;
