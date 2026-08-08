"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronIcon, GalleryIcon } from "@/assets/Icons";
import { resolveImg } from "@/utils/imageSrc";

import ModalContainer from "../modal/ModalContainer";
import BranchCardModal from "./BranchCardModal";
import BranchOpenTag from "../BranchOpenTag";


const BranchCard = ({ images, name, address, path, isOpen: branchIsOpen }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white md:h-[410px] h-[140px] md:block flex group border border-border hover:border-primary rounded-lg transition-all duration-300 overflow-hidden">
            <div className="relative md:w-full w-[45%] md:h-[280px] group-hover:md:h-[230px] transition-all duration-500">
                <img
                    src={resolveImg(images[0], true)}
                    alt={name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover object-center"
                />
                <div
                    className="absolute top-0 right-0 w-full h-full md:bg-black/50 flex md:items-center md:justify-center justify-start items-end p-2 md:opacity-0 group-hover:opacity-100 duration-600"
                    onClick={() => setIsOpen(true)}
                >
                    <button
                        className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300"
                        aria-label={`نمایش گالری تصاویر ${name}`}
                    >
                        <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                    </button>
                </div>
            </div>
            <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
                <h3 className="md:text-xl font-medium text-foreground md:mb-3.5 mb-2 flex items-center justify-center gap-2">
                    {name}
                    <BranchOpenTag isOpen={branchIsOpen} />
                </h3>
                <p className="text-muted-fg md:text-base text-sm md:mb-4">{address}</p>
                <Link href={`/branches?branch=${path}`}>
                    <button className="md:flex items-center flex-nowrap hidden absolute -bottom-20 group-hover:bottom-0 right-[50%] translate-x-[50%] border border-primary-hover rounded-md text-primary-hover text-super-sm py-1 px-4 leading-6 transition-all duration-600">
                        صفحه شعبه <ChevronIcon className="fill-primary-hover rotate-90 inline" />
                    </button>
                </Link>
            </div>

            <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
                <BranchCardModal name={name} images={images} setIsOpen={setIsOpen} />
            </ModalContainer>

        </div>
    );
}

export default BranchCard;
