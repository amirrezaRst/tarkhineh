import Searchbox from "../Searchbox";
import Slider from "../Slider";
import Footer from "./Footer";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";
import { ToastContainer } from "react-toastify";

const MainLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Slider />
            <Searchbox />

            {/* <BottomNavbar /> */}

            {children}

            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
            />
        </>
    );
}

export default MainLayout;