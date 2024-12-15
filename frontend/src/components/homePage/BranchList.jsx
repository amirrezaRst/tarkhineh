import BranchCard from './BranchCard';
import { branchList } from "@/constant/branchList"

const BranchList = () => (
    <section className="container lg:py-20 pt-12 pb-20">
        <h4 className="md:text-3xl text-2.5xl font-semibold text-center">ترخینه گردی</h4>
        <div className="grid xl:grid-cols-4 md:grid-cols-2 xl:gap-7 md:gap-10 gap-5 md:mt-11 mt-7">
            {branchList.map(({ name, images, address }, index) => (
                <BranchCard key={index} imageSrc={images[0]} name={name} address={address} />
            ))}
        </div>
    </section>
);

export default BranchList;
