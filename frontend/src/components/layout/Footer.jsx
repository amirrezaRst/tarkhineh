"use client";

import Link from "next/link";

import { InstagramIcon, TelegramIcon, TwitterIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import useBranches from "@/hooks/useBranches";
import ContactForm from "./ContactForm";


const Footer = () => {
    const branches = useBranches();

    return (
        <footer className="w-full py-20 bg-[url('/images/footer-background-hero.jpg')] bg-cover bg-center">
            <div className="container grid xl:grid-cols-2 xl:gap-4 gap-14">

                {/*//TODO Right Side */}
                <div className="flex items-center xl:justify-around xl:gap-4 md:gap-40 gap-12">

                    {/*//TODO Links */}
                    <div>
                        <h5 className="text-white md:text-lg font-semibold mb-6">
                            دسترسی آسان
                        </h5>
                        <ul className="space-y-4 text-border-subtle md:text-super-sm text-sm font-light">
                            <li><PreserveQueryLink href="/faq">پرسش های متداول</PreserveQueryLink></li>
                            <li><PreserveQueryLink href="/rules">قوانین ترخینه</PreserveQueryLink></li>
                            <li><PreserveQueryLink href="/privacy">حریم خصوصی</PreserveQueryLink></li>
                        </ul>
                        {/* Not list items — a <div> as a direct child of <ul> is
                            invalid list markup (Lighthouse a11y flagged this).
                            mt-4 keeps the same gap the list's own space-y-4 gave it. */}
                        <div className="flex items-center gap-5 text-border-subtle/60 mt-4">
                            <TwitterIcon />
                            <InstagramIcon />
                            <TelegramIcon />
                        </div>
                    </div>

                    {/*//TODO Links */}
                    <div>
                        <h5 className="text-white md:text-lg font-semibold mb-6">
                            شعبه های ترخینه
                        </h5>
                        <ul className="space-y-4 text-border-subtle md:text-super-sm text-sm font-light">
                            {(branches || []).map((b) => (
                                <li key={b.id}>
                                    <Link href={{ pathname: "/branches", query: { branch: b.id } }}>شعبه {b.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/*//TODO Left Side */}
                <div className="">
                    <h5 className="text-white lg:text-2.5xl text-1.5xl font-semibold mb-7">
                        پیام به ترخینه
                    </h5>

                    <ContactForm />

                </div>


            </div>
        </footer>
    );
}

export default Footer;