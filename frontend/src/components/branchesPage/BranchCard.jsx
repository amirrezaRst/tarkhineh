import Image from "next/image";
import Link from "next/link";

const BranchCard = ({ imageSrc, name, address, href, path }) => {
    return (
        <Link href={`/${href}?branch=${path}`}>
            <div className="bg-white md:h-[410px] h-[140px] md:block flex group border border-border hover:border-primary hover:shadow-lg hover:-translate-y-0.5 rounded-lg transition-all duration-300 overflow-hidden">
                <div className="relative md:w-full w-[45%] md:h-[280px] transition-all duration-500">
                    <Image
                        src={`/images/${imageSrc}`}
                        alt={name}
                        className="w-full h-full object-cover object-center"
                        width={200}
                        height={200}
                        quality={100}
                    />
                </div>
                <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
                    <h3 className="md:text-xl font-medium text-foreground md:mb-3.5 mb-2">{name}</h3>
                    <p className="text-muted-fg md:text-base text-sm md:mb-4">{address}</p>
                </div>
            </div>
        </Link>
    );
}

export default BranchCard;