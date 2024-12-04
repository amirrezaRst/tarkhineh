import { PenIcon, TrashIcon } from "@/assets/Icons";

const AddressPage = () => {
    return (
        <>

            {/*//! START Items List */}
            <div
                className="grid lg:grid-cols-2 xl:gap-7 lg:gap-3.5 gap-5 mt-4"
            >


                {/*//TODO Single Address Card */}
                <div
                    className="bg-[#F9F9F9] border border-[#CBCBCB] rounded-lg py-5 px-4"
                >

                    <div className="flex items-start justify-between gap-2.5">
                        <p className="text-[#353535] xl:text-base text-super-sm">
                            تهران: اقدسیه، بزرگراه ارتش، مجتمع شمیران سنتر، طبقه ۱۰
                        </p>
                        <div className="flex gap-1.5">
                            <button className="p-0.5">
                                <PenIcon className="w-[21px] h-[21px] fill-[#353535]" />
                            </button>
                            <button className="p-0.5">
                                <TrashIcon className="w-[21px] h-[21px] fill-[#353535]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[#717171] xl:text-base md:text-super-sm text-sm mt-4">

                        <p>محل کار</p>
                        <p>سردار وظیفه</p>
                        <p dir="ltr">۰۹۱۴ ۸۶۴ ۳۳۵۰</p>

                    </div>

                </div>

                {/*//TODO Single Address Card */}
                <div
                    className="bg-[#F9F9F9] border border-[#CBCBCB] rounded-lg py-5 px-4"
                >

                    <div className="flex items-start justify-between gap-2.5">
                        <p className="text-[#353535] xl:text-base text-super-sm">
                            تهران: اقدسیه، بزرگراه ارتش، مجتمع شمیران سنتر، طبقه ۱۰
                        </p>
                        <div className="flex gap-1.5">
                            <button className="p-0.5">
                                <PenIcon className="w-[21px] h-[21px] fill-[#353535]" />
                            </button>
                            <button className="p-0.5">
                                <TrashIcon className="w-[21px] h-[21px] fill-[#353535]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[#717171] xl:text-base md:text-super-sm text-sm mt-4">

                        <p>محل کار</p>
                        <p>سردار وظیفه</p>
                        <p dir="ltr">۰۹۱۴ ۸۶۴ ۳۳۵۰</p>

                    </div>

                </div>


            </div>
            {/*//? END Items List */}

        </>
    );
}

export default AddressPage;