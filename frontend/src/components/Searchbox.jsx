import { SearchIcon } from "@/assets/Icons";

const Searchbox = () => {
    return (
        <div className="container mt-6">
            <form
                className="relative w-full h-11 md:hidden block rounded-lg border border-[#CBCBCB] overflow-hidden"
            >
                <input
                    type="text"
                    placeholder="جستجو"
                    className="w-full h-full bg-transparent px-4 text-[#353535] placeholder:text-[#353535] focus:ring-0 focus:outline-none"
                />
                <button className="w-11 h-11 absolute top-0 left-0 flex items-center justify-center">
                    <SearchIcon className="fill-[#353535]" />
                </button>
            </form>
        </div>
    );
}

export default Searchbox;