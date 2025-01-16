"use client";

import { useState } from "react";
import { PenIcon, TrashIcon, XmarkIcon } from "@/assets/Icons";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import DeleteAddressPopup from "./DeleteAddressPopup";
import ModalContainer from "@/components/modal/ModalContainer";
import EditAddressModal from "./EditAddressModal";

const AddressCard = ({ index, title, addressLine, recipientPhoneNumber, recipientFullName, userId }) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEdit = async () => {

    };

    return (
        <>
            <div
                className="bg-[#F9F9F9] border border-[#CBCBCB] rounded-lg py-5 px-4 hover:shadow-md duration-300"
            >

                <div className="flex items-start justify-between gap-2.5">
                    <p className="text-[#353535] xl:text-base text-super-sm line-clamp-2">{addressLine}</p>
                    <div className="flex gap-1.5">
                        <button className="p-0.5" onClick={() => setIsEditOpen(true)}>
                            <PenIcon className="w-[21px] h-[21px] fill-[#353535]" />
                        </button>
                        <button className="p-0.5" onClick={() => setIsDeleteOpen(true)}>
                            <TrashIcon className="w-[21px] h-[21px] fill-[#353535]" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-[#717171] xl:text-base md:text-super-sm text-sm capitalize mt-4">

                    <p>{title}</p>
                    <p>{recipientFullName}</p>
                    <p dir="ltr">{ConvertToPersianNumbers(recipientPhoneNumber)}</p>

                </div>

            </div>

            <DeleteAddressPopup isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} index={index} userId={userId} />

            <EditAddressModal
                userId={userId}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                values={{ title, addressLine, recipientFullName, recipientPhoneNumber }}
                index={index}
            />

        </>
    );
}

export default AddressCard;