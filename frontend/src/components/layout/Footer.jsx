import Link from "next/link";

import { InstagramIcon, TelegramIcon, TwitterIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";


const Footer = () => {
    return (
        <footer className="w-full py-20 bg-[url('/images/footer-background-hero.jpg')] bg-cover bg-center">
            <div className="container grid xl:grid-cols-2 xl:gap-4 gap-14">

                {/*//TODO Right Side */}
                <div className="flex items-center xl:justify-around xl:gap-4 md:gap-40 gap-12">

                    {/*//TODO Links */}
                    <div>
                        <h6 className="text-white md:text-lg font-semibold mb-6">
                            دسترسی آسان
                        </h6>
                        <ul className="space-y-4 text-border-subtle md:text-super-sm text-sm font-light">
                            <li><PreserveQueryLink href="/faq">پرسش های متداول</PreserveQueryLink></li>
                            <li><PreserveQueryLink href="/rules">قوانین ترخینه</PreserveQueryLink></li>
                            <li><PreserveQueryLink href="/privacy">حریم خصوصی</PreserveQueryLink></li>
                            <div className="flex items-center gap-5">
                                <a href=""><TwitterIcon /></a>
                                <a href=""><InstagramIcon /></a>
                                <a href=""><TelegramIcon /></a>
                            </div>
                        </ul>
                    </div>

                    {/*//TODO Links */}
                    <div>
                        <h6 className="text-white md:text-lg font-semibold mb-6">
                            شعبه های ترخینه
                        </h6>
                        <ul className="space-y-4 text-border-subtle md:text-super-sm text-sm font-light">
                            <li><Link href={{ pathname: "/branches", query: { branch: "tehranpars" } }}>شهبه تهرانپارس</Link></li>
                            <li><Link href={{ pathname: "/branches", query: { branch: "chalous" } }}>شعبه چالوس</Link></li>
                            <li><Link href={{ pathname: "/branches", query: { branch: "aghdasiyeh" } }}>شعبه اقدسیه</Link></li>
                            <li><Link href={{ pathname: "/branches", query: { branch: "vanak" } }}>شعبه ونک</Link></li>
                        </ul>
                    </div>

                </div>

                {/*//TODO Left Side */}
                <div className="">
                    <h6 className="text-white lg:text-2.5xl text-1.5xl font-semibold mb-7">
                        پیام به ترخینه
                    </h6>

                    <form action="" className="">
                        <div className="grid md:grid-cols-2 gap-4">

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="نام و نام خانوادگی"
                                    className="bg-transparent w-full backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background"
                                />
                                <input
                                    type="text"
                                    placeholder="شماره تماس"
                                    className="bg-transparent w-full backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background"
                                />
                                <input
                                    type="text"
                                    placeholder="آدرس ایمیل (اختیاری)"
                                    className="bg-transparent w-full backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background"
                                />
                            </div>

                            <textarea
                                name=""
                                id=""
                                placeholder="پیام شما"
                                className="bg-transparent w-full md:h-full h-40 backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background"
                            />

                        </div>

                        <p className="text-sm text-border mt-2 text-left">۰/۲۰۰</p>
                        <button className="text-background text-super-sm border border-muted-fg rounded-lg float-left mt-2 py-2.5 px-16">
                            ارسال پیام
                        </button>
                    </form>

                </div>


            </div>
        </footer>
    );
}

export default Footer;