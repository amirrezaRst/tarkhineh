import Image from "next/image";
import BranchOpenTag from "../BranchOpenTag";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const BranchCard = ({ imageSrc, name, address, href, path, isOpen }) => {
    return (
        <PreserveQueryLink href={`/${href}`} query={{ branch: path }}>
            <div className="bg-white md:h-[410px] h-[140px] md:block flex group border border-border hover:border-primary hover:shadow-lg hover:-translate-y-0.5 rounded-lg transition-all duration-300 overflow-hidden">
                <div className="relative md:w-full w-[45%] md:h-[280px] transition-all duration-500">
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 45vw, 400px"
                        className="object-cover object-center"
                    />
                </div>
                <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
                    <h3 className="md:text-xl font-medium text-foreground md:mb-3.5 mb-2 flex items-center justify-center gap-2">
                        {name}
                        <BranchOpenTag isOpen={isOpen} />
                    </h3>
                    <p className="text-muted-fg md:text-base text-sm md:mb-4">{address}</p>
                </div>
            </div>
        </PreserveQueryLink>
    );
}

export default BranchCard;