import Searchbox from "../Searchbox";
import Slider from "../Slider";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Slider />
            {/* <Searchbox /> */}

            {children}

            <Footer />
        </>
    );
}

export default MainLayout;