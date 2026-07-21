import { SearchIcon } from "@/assets/Icons";

const SearchBox = () => {
    return (
        <form
            className="relative xl:h-11 md:h-auto h-11 md:py-3 py-0 xl:w-auto w-full flex-1 rounded-lg border border-border overflow-hidden"
        >
            <input
                type="text"
                placeholder="جستجو"
                className="w-full h-full bg-transparent px-4 text-foreground placeholder:text-foreground focus:ring-0 focus:outline-none"
            />
            <button className="w-11 h-11 my-auto absolute top-0 left-0 flex items-center justify-center">
                <SearchIcon className="fill-foreground" />
            </button>
        </form>
    );
}

export default SearchBox;