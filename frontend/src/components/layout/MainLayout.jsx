"use client";

import Searchbox from "../Searchbox";
import Slider from "../Slider";
import Footer from "./Footer";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";


const MainLayout = ({ children }) => {

    const pathname = usePathname();
    const isPanelRoute = pathname.startsWith("/panel") || pathname.startsWith("/admin");

    return (
        <>
            {!isPanelRoute && (
                <>
                    <Navbar />
                    <Slider />
                    <Searchbox />
                    {/* <BottomNavbar /> */}
                </>
            )}

            {isPanelRoute ? children : <main>{children}</main>}

            {!isPanelRoute && <Footer />}

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