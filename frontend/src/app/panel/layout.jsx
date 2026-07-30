import MainLayout from "@/components/layout/panel/PanelLayout";

// Internal, role-gated tooling — never indexed or crawled.
export const metadata = {
    title: "پنل کاربری",
    robots: { index: false, follow: false },
};

const PanelLayout = ({ children }) => {
    return (
        <>

            <MainLayout>


                {children}


            </MainLayout>

        </>
    );
}

export default PanelLayout;