import SidebarNav from "./SidebarNav";
import UserInfo from "./UserInfo";

const Sidebar = () => {
    return (
        <aside
            className="h-fit col-span-3 border border-[#CBCBCB] rounded-lg py-6 px-5"
        >

            <UserInfo />

            <SidebarNav />

        </aside>
    );
}

export default Sidebar;