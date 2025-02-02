import { CirclePlusIcon, LocationIcon } from "@/assets/Icons";
import AddressPage from "../profile/address/page";
import NewAddressModal from "../profile/address/NewAddressModal";
import { useState, useEffect } from "react";
import useUserStore from "@/stores/useUserStore";

const DeliveryAddress = ({ selectedAddress, setSelectedAddress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore(state => state.user);

    useEffect(() => {
        if (user?.addresses && user?.addresses?.length > 0) {
            setSelectedAddress(0);
        }
    }, [user?.addresses, setSelectedAddress]);

    return (
        <div className="border border-[#CBCBCB] rounded-lg px-9 py-8">
            <div className="flex items-center justify-between border-b border-b-[#CBCBCB] pb-3.5 mb-7">
                <div className="flex items-center gap-1">
                    <LocationIcon className="w-5 h-5 fill-[#353535]" />
                    <p className="text-lg text-[#353535]">آدرس ها</p>
                </div>

                <div className="flex items-center gap-0.5 cursor-pointer" onClick={() => setIsOpen(true)}>
                    <CirclePlusIcon className="w-6 h-6" />
                    <p className="text-[#417F56]">افزودن آدرس</p>
                </div>
            </div>

            <AddressPage cartPage={true} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
            <NewAddressModal isOpen={isOpen} setIsOpen={setIsOpen} userId={user?._id} />
        </div>
    );
}

export default DeliveryAddress;
