import { FolderAdd } from "@/assets/Icons";
import FeatureItem from "./FeatureItem";
import FileFieldBox from "./FileFieldBox";

const features = [
    "پروانه کسب دارد.",
    "آشپزخانه دارد.",
    "پارکینگ داد.",
    "انبار دارد.",
]

const FeatureForm = () => {
    return (
        <>
            <p className="lg:text-xl md:text-lg md:font-normal font-medium text-[#353535] md:mb-8 mb-10">
                امکانات ملک متقاضی
            </p>

            <div className="grid md:grid-cols-2 lg:gap-6 md:gap-2 gap-10 mb-8">

                <div>

                    <p className="text-[#717171] text-super-base mb-5">
                        ملک متقاضی:
                    </p>

                    <div className="grid grid-cols-2 gap-6">

                        {features.map((item, index) =>
                            <FeatureItem key={index} text={item} index={index} />
                        )}

                    </div>

                </div>

                <div className="">

                    <p className="text-[#717171] text-super-base md:mb-5 mb-3.5">
                        تصاویر ملک
                    </p>

                   <FileFieldBox />

                </div>

            </div>
        </>
    );
}

export default FeatureForm;