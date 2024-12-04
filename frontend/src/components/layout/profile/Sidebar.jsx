import UserInfo from './UserInfo';
import SidebarNav from './SidebarNav';

const Sidebar = () => {

    return (
        <aside
            className="w-full h-fit bg-white md:sticky md:top-24 fixed bottom-0 left-0 right-0 lg:col-span-3 col-span-2 md:-order-2 -order-1 border border-[#CBCBCB] md:rounded-lg rounded-t-xl xl:py-6 md:py-4 xl:px-5 px-3.5"
        >
            <UserInfo />

            <SidebarNav />

        </aside>
    );
};

export default Sidebar;
