import MainLayout from "@/components/layout/panel/PanelLayout";

// Internal, role-gated tooling — never indexed or crawled.
export const metadata = {
    title: "پنل مدیریت",
    robots: { index: false, follow: false },
};

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