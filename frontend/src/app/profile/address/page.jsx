"use client";

import { useState } from "react";
import useUserStore from "@/stores/useUserStore";
import AddressCardSkeleton from "./AddressCardSkeleton";
import EmptyAddressesList from "./EmptyAddressesList";
import AddressCard from "./AddressCard";
import NewAddressModal from "./NewAddressModal";


const AddressPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore(state => state.user);

    return (
        <>

            {user?.addresses === null || user?.addresses === undefined ?
                (
                    <div
                        className="grid lg:grid-cols-2 xl:gap-7 lg:gap-3.5 gap-5 mt-4"
                    >
                        <AddressCardSkeleton />
                    </div>
                ) :
                user?.addresses?.length === 0 ?
                    <EmptyAddressesList /> :
                    (
                        <>
                            <div
                                className="grid lg:grid-cols-2 xl:gap-7 lg:gap-3.5 gap-5 mt-4"
                            >
                                {user?.addresses.map((item, index) =>
                                    <AddressCard index={index} key={index} {...item} userId={user?._id} />
                                )}
                            </div>
                            <button
                                className="border border-[#417F56] rounded-md text-[#417F56] text-super-sm px-12 py-2 mx-auto block mt-7"
                                onClick={() => setIsOpen(true)}
                            >
                                افزودن آدرس جدید
                            </button>
                        </>
                    )
            }

            <NewAddressModal isOpen={isOpen} setIsOpen={setIsOpen} userId={user?._id} />

        </>
    );
}

export default AddressPage;