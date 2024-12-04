import UserInfo from './UserInfo';
import SidebarNav from './SidebarNav';

const Sidebar = () => {

    return (
        <aside
            className="w-full h-fit bg-white md:static fixed bottom-0 left-0 right-0 z-10 lg:col-span-3 col-span-2 md:-order-2 -order-1 border border-[#CBCBCB] rounded-lg xl:py-6 md:py-4 xl:px-5 px-3.5"
        >
            <UserInfo />

            <SidebarNav />

        </aside>
        // <div className="relative container xl:py-20 py-16 grid lg:col-span-3 col-span-2 2xl:gap-8 gap-5">
        //     <aside
        //         className={`-order-1 w-full h-fit bg-white md:static lg:col-span-3 md:col-span-2 col-span-12 
        //     border border-[#CBCBCB] rounded-lg xl:py-6 md:py-4 xl:px-5 px-3.5 fixed bottom-0 left-0 right-0 z-10`}
        //     >
        //         <UserInfo />
        //         <SidebarNav />
        //     </aside>
        // </div>
    );
};

export default Sidebar;
