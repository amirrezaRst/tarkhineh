"use client";

import { useState } from "react";
import CardImage from "./CardImage";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import ModalContainer from "@/components/modal/ModalContainer";
import BranchCardModal from "@/components/homePage/BranchCardModal";
import BranchOpenTag from "@/components/BranchOpenTag";


const RestaurantCard = ({ name, address, phone, hoursLabel, isOpen: branchIsOpen, images, path, map }) => {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div
            className="xl:h-[330px] lg:h-[300px] md:h-[300px] group border border-border rounded-lg grid xl:grid-cols-2 md:grid-cols-12 hover:shadow-md overflow-hidden duration-400"
        >

            <CardImage imageSrc={images[0]} brach={name} setIsOpen={setIsOpen} />

            <div className="flex flex-col items-center xl:py-11 lg:py-9 md:py-5 pt-6 pb-8 xl:col-span-1 md:col-span-7">
                <h2 className="lg:text-2xl md:text-1.5xl text-xl text-foreground text-center font-semibold xl:mb-9 lg:mb-6 mb-4 flex items-center justify-center gap-2">
                    شعبه {name}
                    <BranchOpenTag isOpen={branchIsOpen} />
                </h2>

                <div
                    className="relative xl:space-y-4 lg:space-y-3 md:space-y-2.5 space-y-3 lg:text-super-base md:text-base text-super-sm text-muted-fg text-center pb-16 px-4"
                >
                    <p className="">{address}</p>
                    <p className="">شماره تماس: <span dir="ltr">{phone}</span></p>
                    <p className="">ساعت کاری: {hoursLabel}</p>

                    <div
                        className="w-full absolute md:-bottom-32 group-hover:md:bottom-0 right-[50%] translate-x-[50%] flex items-center justify-center gap-4 md:pt-0 pt-2 duration-400"
                    >
                        <PreserveQueryLink href="/branches" query={{ branch: path }}>
                            <button
                                className="h-10 bg-white border border-primary rounded-md text-primary text-super-sm leading-5 font-medium px-7"
                            >
                                صفحه شعبه
                            </button>
                        </PreserveQueryLink>
                        {map &&
                            <a href={map} target="_blank" rel="noreferrer">
                                <button
                                    className="h-10 bg-primary border border-primary rounded-md text-white text-super-sm leading-5 px-7"
                                >
                                    دیدن در نقشه
                                </button>
                            </a>
                        }
                    </div>

                </div>
            </div>

            <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
                <BranchCardModal name={name} images={images} setIsOpen={setIsOpen} />
            </ModalContainer>

        </div>
    );
}

export default RestaurantCard;