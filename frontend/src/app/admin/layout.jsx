import MainLayout from "@/components/layout/panel/PanelLayout";


const AdminLayout = ({ children }) => {
    return (
        <>

            <MainLayout>

                {children}

            </MainLayout>

        </>
    );
}

export default AdminLayout;