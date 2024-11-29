import { BankIcon, BookIcon, ChartIcon, FolderAdd, WalletIcon } from "@/assets/Icons";
import HeaderBanner from "@/components/HeaderBanner";

const FranchisePage = () => {
    return (
        <>

            <HeaderBanner title="همین الان به خانواده بزرگ ترخینه بپیوندید!" imageSrc="/images/franchise-background-hero.jpg" />


            {/*//! START Options Section */}
            <section className="container py-20 border-b-2 border-[#CBCBCB]/30 grid grid-cols-4 gap-6">

                {/*//Todo Option */}
                <div className="flex flex-col items-center gap-6">

                    <div className="w-36 h-36 flex items-center justify-center border-2 border-[#417F56] rounded-full p-4">
                        <BankIcon />
                    </div>

                    <h6 className="text-lg text-[#353535] leading-7">
                        بیش از 20 شعبه فعال در سراسر کشور
                    </h6>

                </div>

                {/*//Todo Option */}
                <div className="flex flex-col items-center gap-6">

                    <div className="w-36 h-36 flex items-center justify-center border-2 border-[#417F56] rounded-full p-4">
                        <WalletIcon />
                    </div>

                    <h6 className="text-lg text-[#353535] leading-7">
                        تسهیلات راه‌اندازی رستوران و تجهیز آن
                    </h6>

                </div>

                {/*//Todo Option */}
                <div className="flex flex-col items-center gap-6">

                    <div className="w-36 h-36 flex items-center justify-center border-2 border-[#417F56] rounded-full p-4">
                        <ChartIcon />
                    </div>

                    <h6 className="text-lg text-[#353535] leading-7">
                        طرح‌های تشویقی ارتقای فروش
                    </h6>

                </div>

                {/*//Todo Option */}
                <div className="flex flex-col items-center gap-6">

                    <div className="w-36 h-36 flex items-center justify-center border-2 border-[#417F56] rounded-full p-4">
                        <BookIcon />
                    </div>

                    <h6 className="text-lg text-[#353535] leading-7">
                        اعطای دستورالعمل پخت غذاها
                    </h6>

                </div>

            </section>
            {/*//? END Options Section */}


            {/*//! START Benefits Section */}
            <section className="container py-20 border-b-2 border-[#CBCBCB]/30">
                <h2 className="text-2.5xl text-[#353535] text-center font-semibold mb-10">
                    مزیت دریافت نمایندگی
                </h2>

                {/*//! Benefits List */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-52">

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            استفاده از برند شناخته شده ترخینه
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            مشاوره در امور حقوقی، مالی و مالیاتی
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            به حداقل رساندن ریسک سرمایه گذاری
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            پشتیبانی بازاریابی و منابع انسانی
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            تسریع روند بازگشت سرمایه
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            دریافت مشاوره جهت تامین مواد اولیه و تجهیزات
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            مشاوره های تخصصی جهت مدیریت رستوران
                        </p>
                    </div>

                    {/*//TODO Benefit */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-[#417F56]" />
                        <p className="text-[19px] leading-7 text-[#353535]">
                            طرح های تشویقی برای ارتقا فروش
                        </p>
                    </div>

                </div>

            </section>
            {/*//? END Benefits Section */}



            {/*//! START Consultation Section */}
            <section className="container py-20 border-b-2 border-[#CBCBCB]/30">

                <h2 className="text-2.5xl text-[#353535] text-center font-semibold mb-12">
                    دریافت مشاوره
                </h2>

                {/*//! Consultation Form */}
                <form action="">

                    <div className="grid grid-cols-3 gap-6">

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

                    <button className="bg-[#417F56] text-white text-super-sm block mx-auto rounded-md py-3 px-6 mt-7">
                        درخواست مشاوره
                    </button>

                </form>

            </section>
            {/*//? END Consultation Section */}



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