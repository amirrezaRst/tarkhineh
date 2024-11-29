import { BankIcon, BookIcon, ChartIcon, FolderAdd, WalletIcon } from "@/assets/Icons";
import HeaderBanner from "@/components/HeaderBanner";
import OptionsSection from "./OptionsSection";
import BenefitsSection from "./BenefitsSection";
import ConsultationSection from "./CunsultationSection";

const FranchisePage = () => {
    return (
        <>

            <HeaderBanner title="همین الان به خانواده بزرگ ترخینه بپیوندید!" imageSrc="/images/franchise-background-hero.jpg" />

            {/*//! Options Section */}
            <OptionsSection />


            {/*//! Benefits Section */}
            <BenefitsSection />

            {/*//! Consultation Section */}
            <ConsultationSection />



            {/*//! START Agency Form */}
            <section className="container my-24 py-14 border border-[#CBCBCB]/40 rounded-lg">

                <h2 className="text-2.5xl text-[#353535] text-center font-semibold mb-12">
                    فرم درخواست نمایندگی
                </h2>


                <form action="">

                    <p className="text-xl text-[#353535] mb-4">
                        مشخصات فردی متقاضی
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-12">

                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171]"
                            placeholder="نام و نام خانوادگی"
                        />
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171]"
                            placeholder="شماره تماس"
                        />
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171]"
                            placeholder="ایمیل"
                        />

                    </div>

                    <p className="text-xl text-[#353535] mb-4">
                        آدرس ملک متقاضی
                    </p>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-1 mb-12">

                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171] h-fit"
                            placeholder="استان"
                        />
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171] h-fit"
                            placeholder="شهر"
                        />
                        <div className="flex col-span-1 row-span-2 bg-red-400">
                            <img src="/images/map-image.jpg" alt="" className="" />
                        </div>
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171] h-fit"
                            placeholder="منطقه"
                        />
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171] h-full"
                            placeholder="آدرس دقیق"
                        />

                    </div>

                    <p className="text-xl text-[#353535] mb-4">
                        مشخصات ملک متقاضی
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-12">

                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171]"
                            placeholder="نوع مالکیت"
                        />
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171]"
                            placeholder="مساحت ملک (متر مربع)"
                        />
                        <input
                            type="text"
                            className="py-2.5 px-4 border border-[#CBCBCB] rounded-md text-[#717171] placeholder:text-[#717171]"
                            placeholder="سن بنا"
                        />

                    </div>

                    <p className="text-xl text-[#353535] mb-8">
                        امکانات ملک متقاضی
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-8">

                        <div>

                            <p className="text-[#717171] text-super-base mb-5">
                                ملک متقاضی:
                            </p>

                            <div className="grid grid-cols-2 gap-6">

                                {/*//TODO Item */}
                                <div className="flex items-center gap-2.5 text-[#717171]">
                                    <input type="checkbox" name="" id="item-1" className="appearance-none ring-1 ring-[#417F56] checked:bg-[#417F56]/85 rounded-sm p-1.5" />
                                    <label htmlFor="item-1">
                                        پروانه کسب دارد.
                                    </label>
                                </div>
                                {/*//TODO Item */}
                                <div className="flex items-center gap-2.5 text-[#717171]">
                                    <input type="checkbox" name="" id="item-1" className="appearance-none ring-1 ring-[#417F56] checked:bg-[#417F56]/85 rounded-sm p-1.5" />
                                    <label htmlFor="item-2">
                                        آشپزخانه دارد.
                                    </label>
                                </div>
                                {/*//TODO Item */}
                                <div className="flex items-center gap-2.5 text-[#717171]">
                                    <input type="checkbox" name="" id="item-1" className="appearance-none ring-1 ring-[#417F56] checked:bg-[#417F56]/85 rounded-sm p-1.5" />
                                    <label htmlFor="item-3">
                                        پارکینگ داد.
                                    </label>
                                </div>
                                {/*//TODO Item */}
                                <div className="flex items-center gap-2.5 text-[#717171]">
                                    <input type="checkbox" name="" id="item-1" className="appearance-none ring-1 ring-[#417F56] checked:bg-[#417F56]/85 rounded-sm p-1.5" />
                                    <label htmlFor="item-4">
                                        انبار دارد.
                                    </label>
                                </div>

                            </div>

                        </div>

                        <div className="">

                            <p className="text-[#717171] text-super-base mb-5">
                                تصاویر ملک
                            </p>

                            <div className="h-[235px] relative border border-[#CBCBCB] rounded-md flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <FolderAdd className="w-[60px] h-[60px]" />
                                    <p className="text-[#717171]">
                                        تصاویری از ملک را بارگذاری کنید...
                                    </p>
                                </div>

                                <input type="file" name="" id="" className="w-full h-full absolute top-0 right-0 opacity-0 cursor-pointer" />
                            </div>

                        </div>

                    </div>


                    <button className="bg-[#417F56] text-white text-super-sm block mx-auto rounded-md py-3 px-14 mt-7">
                        ثبت اطلاعات
                    </button>

                </form>

            </section>
            {/*//? END Agency Form */}


        </>
    );
}

export default FranchisePage;