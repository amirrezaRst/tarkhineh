import { XmarkIcon } from "@/assets/Icons";
import FormField from "@/components/FormField";
import ModalContainer from "@/components/modal/ModalContainer";
import { handleEditAddress } from "@/services/AddressService";
import useUserStore from "@/stores/useUserStore";
import { useForm } from "react-hook-form";
import EditAddressForm from "./AddressForm";
import { useState } from "react";

const EditAddressModal = ({ userId, isOpen, setIsOpen, values, index }) => {
    const setUser = useUserStore(state => state.setUser);
    const user = useUserStore(state => state.user);
    const [isMyself, setIsMyself] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        defaultValues: {
            "title": values.title,
            "recipientFullName": values.recipientFullName,
            "recipientPhoneNumber": values.recipientPhoneNumber,
            "addressLine": values.addressLine
        }
    });

    const handleEdit = async (data) => {
        const body = {
            title: data.title,
            addressLine: data.addressLine,
            recipientPhoneNumber: isMyself ? user.phoneNumber : data.recipientPhoneNumber,
            recipientFullName: isMyself && user?.fullName ? user.fullName : data.recipientFullName,
        }

        handleEditAddress(userId, index, body, setIsOpen, setUser);
    };


    return (
        <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>

            <div
                className="bg-white w-[600px] rounded-lg overflow-hidden"
            >

                {/*//! Title */}
                <div className="relative bg-surface-sunken w-full py-5">
                    <h6 className="text-center text-foreground font-medium text-xl">ویرایش آدرس</h6>
                    <button className="absolute top-5 left-6 p-1" onClick={() => setIsOpen(false)}>
                        <XmarkIcon className="fill-muted-fg w-7 h-7" />
                    </button>
                </div>

                {/*//! Form Content */}
                <form
                    className="px-6 mt-4 pb-9"
                    onSubmit={handleSubmit(data => handleEdit(data))}
                >
                    <EditAddressForm register={register} errors={errors} isMyself={isMyself} setIsMyself={setIsMyself} editPage />

                    <div className="flex gap-3 mt-2">
                        <button
                            className="bg-primary-subtle rounded-md text-primary text-super-sm font-medium flex-1 py-2 leading-6"
                        >
                            ویرایش آدرس انتخابی
                        </button>
                        <button
                            className="bg-primary rounded-md text-white text-super-sm font-medium flex-1 py-2 leading-6"
                            type="submit"
                        >
                            ثبت آدرس
                        </button>
                    </div>

                </form>

            </div>

        </ModalContainer>
    );
}

export default EditAddressModal;