import { SearchIcon } from "@/assets/Icons";

const SearchBox = () => {
    return (
        <form
            className="relative xl:w-[450px] lg:w-[350px] md:w-[45%] w-full h-11 rounded-lg border border-[#CBCBCB] overflow-hidden"
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
    );
}

export default SearchBox;