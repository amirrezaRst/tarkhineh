import Image from "next/image";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const EmptyCart = () => {
    return (
        <div className="relative min-h-96 border border-border rounded-lg overflow-hidden flex flex-col items-center justify-center">


            <Image
                src="/images/spider-background.png"
                alt="spider background"
                width={325}
                height={313}
                className="md:w-auto w-[80%] h-auto absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] opacity-35"
            />

            <div className="flex flex-col items-center gap-7 z-10">
                <p className="md:text-1.5xl  text-muted-fg text-center">
                    شما در حال حاظر هیچ سفارشی ثبت نکرده اید!
                </p>
                <PreserveQueryLink
                    href="/menus"
                    className="border border-primary rounded-md text-primary md:text-lg text-super-xs md:px-12 px-6 md:py-2 py-1.5"
                >
                    <button>
                        منوی رستوران
                    </button>
                </PreserveQueryLink>
            </div>

        </div>
    );
}

export default EmptyCart;