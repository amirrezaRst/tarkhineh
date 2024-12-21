import MostSearchedList from "./MostSearchedList";
import SearchBox from "./SearchBox";

const SearchSection = () => {
    return (
        <div className="container md:py-8 py-6 flex md:flex-row flex-col items-center justify-between xl:gap-10 gap-4">


            {/*//! Most Search List */}
            <MostSearchedList />

            {/*//! Search Field */}
           <SearchBox />


        </div>
    );
}

export default SearchSection;