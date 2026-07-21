import { SearchIcon } from "@/assets/Icons";

const SearchBox = () => {
    return (
        <form
            className="relative xl:w-[450px] lg:w-[350px] md:w-[45%] w-full h-11 rounded-lg border border-border overflow-hidden"
        >
            <input
                type="text"
                placeholder="جستجو"
                className="w-full h-full bg-transparent px-4 text-foreground placeholder:text-foreground focus:ring-0 focus:outline-none"
            />
            <button className="w-11 h-11 absolute top-0 left-0 flex items-center justify-center">
                <SearchIcon className="fill-foreground" />
            </button>
        </form>
    );
}

export default SearchBox;