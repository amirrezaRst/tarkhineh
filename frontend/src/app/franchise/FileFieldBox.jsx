import { FolderAdd } from "@/assets/Icons";

const FileFieldBox = () => {
    return (
        <div className="lg:h-[235px] h-48 relative border border-[#CBCBCB] rounded-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <FolderAdd className="lg:w-[60px] lg:h-[60px] w-12 h-12" />
                <p className="lg:text-base text-super-sm text-[#717171]">
                    تصاویری از ملک را بارگذاری کنید...
                </p>
            </div>

            <input type="file" name="" id="" className="w-full h-full absolute top-0 right-0 opacity-0 cursor-pointer" />
        </div>
    );
}

export default FileFieldBox;