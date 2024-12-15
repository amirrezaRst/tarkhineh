import { ChevronIcon, ShoppingCardIcon } from "@/assets/Icons";
import Link from "next/link";

const AboutSectionInfo = () => {
    return (
        <div>
            <h2 className="lg:text-2.5xl text-1.5xl text-white font-semibold mb-5">
                رستوران های زنجیره ای ترخینه
            </h2>
            <p className="text-white lg:text-base text-sm text-justify md:leading-8 leading-7 tracking-wide font-light">
                مهمان‌نوازی یکی از مهم‌ترین مشخصه‌های ایرانیان است و باعث افتخار ماست که بیش از 20 سال است خدمت‌گزار مردم شریف ایران هستیم...
            </p>
            <Link href="/about-us">
                <button className="flex items-center justify-between gap-2 border border-white rounded-md py-2 px-5 md:mt-7 mt-4 float-left">
                    <ShoppingCardIcon className="fill-white w-[22px] h-[22px]" />
                    <span className="text-white text-super-sm">اطلاعات بیشتر</span>
                    <ChevronIcon className="stroke-white rotate-90" />
                </button>
            </Link>
        </div>
    );
}

export default AboutSectionInfo;