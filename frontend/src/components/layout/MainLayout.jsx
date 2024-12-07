import Searchbox from "../Searchbox";
import Slider from "../Slider";
import Footer from "./Footer";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";

const MainLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Slider />
            <Searchbox />

            <BottomNavbar />

            {children}

            <Footer />
        </>
    );
}

export default MainLayout;