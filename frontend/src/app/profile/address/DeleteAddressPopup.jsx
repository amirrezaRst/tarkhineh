import Popup from "@/components/Popup";
import { handleDeleteAddress } from "@/services/AddressService";
import useCartStore from "@/stores/useCartStore";

const DeleteAddressPopup = ({ isOpen, setIsOpen, userId, index }) => {
    const setUser = useCartStore(state => state.setUser);

    const handleDelete = () => {
        handleDeleteAddress(userId, index, setIsOpen, setUser);
    };
    return (
        <Popup isOpen={isOpen} setIsOpen={setIsOpen}>

            {/*//! Content */}
            <div className="min-h-36 flex flex-col justify-center gap-6 px-6">
                <p className="text-super-base text-[#353535] text-center">
                    آیا از حذف آدرس مطمئن هستید؟
                </p>

                <div className="flex gap-3">
                    <button
                        className="rounded-md border border-[#417F56] text-[#417F56] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                        onClick={() => setIsOpen(false)}
                    >
                        بازگشت
                    </button>
                    <button
                        className="bg-[#FFF2F2] rounded-md border border-transparent text-[#C30000] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                        onClick={handleDelete}
                    >
                        حذف
                    </button>
                </div>
            </div>
        </Popup>
    );
}

export default DeleteAddressPopup;