import AboutSection from "@/components/homePage/AboutSection";
import BranchList from "@/components/homePage/BranchList";
import FoodMenu from "@/components/homePage/FoodMenu";


export default function Home() {
  return (
    <>

      {/*//! Menu Type */}
      <FoodMenu />

      {/*//! About Section */}
      <AboutSection />

      {/*//! Branch Section */}
      <BranchList />

    </>
  );
}
