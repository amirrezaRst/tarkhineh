import { ChevronIcon } from "@/assets/Icons";

const Slider = () => {
    return (
        <section className="w-full md:h-[400px] h-[350px] bg-[url('/images/background-hero-1.png')] bg-center bg-cover">

            <div className="relative w-full h-full flex flex-col items-end justify-center">

                <div className="w-full flex items-center justify-between px-6">
                    <button className="p-3 md:block hidden">
                        <ChevronIcon className="-rotate-90 stroke-white w-7 h-7" />
                    </button>
                    <h1 className="text-white xl:text-4.5xl lg:text-4xl text-3xl md:leading-normal leading-[45px] font-bold text-center">
                        تجربه غذای سالم و گیاهی به سبک ترخینه
                    </h1>
                    <button className="p-3 md:block hidden">
                        <ChevronIcon className="rotate-90 stroke-white w-7 h-7" />
                    </button>
                </div>

                <div className="justify-items-end self-center md:mt-8 mt-5">
                    <button className="bg-[#417F56] rounded-lg py-2 px-8 text-white lg:text-base text-super-sm">
                        سفارش آنلاین غذا
                    </button>
                </div>

                <div
                    className="bg-white flex items-center gap-2.5 md:py-3 py-2.5 md:px-9 px-7 rounded-t-2xl absolute -bottom-1 left-[50%] translate-x-[-50%]"
                >

                    <div className="md:w-3 md:h-3 w-2 h-2 bg-[#417F56] rounded-full"></div>
                    <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>
                    <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>
                    <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>
                    <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>

                </div>

            </div>

        </section>
    );
}

export default Slider;