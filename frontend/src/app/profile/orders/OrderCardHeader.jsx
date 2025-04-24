import { branchNamesDic, deliveryTypeDic, orderStatusDic } from "@/constant/branchDictionary";

const OrderCardHeader = ({ branch, status, deliveryType }) => {

    const statusStyles = {
        pending: "bg-[#FFF8E1] text-[#A9791C]",
        preparing: "bg-[#FFF8E1] text-[#A9791C]",
        on_the_way: "bg-[#FFF8E1] text-[#A9791C]",
        delivered: "bg-[#E5F2E9] text-[#417F56]",
        cancelled: "bg-[#FFF2F2] text-[#C30000]",
    };

    const badgeClass = statusStyles[status] || "bg-gray-200 text-gray-600";


    return (
        <div className="flex justify-between gap-4">
            <h2 className="md:text-lg text-super-base text-[#757575] font-medium">شعبه {branchNamesDic[branch]}</h2>
            <div className="flex gap-2 md:text-sm text-xs">
                <span className="bg-[#EDEDED] text-[#353535] rounded-md py-1.5 md:px-3 px-2">{deliveryTypeDic[deliveryType]}</span>
                <span className={`rounded-md py-1.5 md:px-3 px-2 ${badgeClass}`}>{orderStatusDic[status]}</span>
            </div>
        </div>
    );
}

export default OrderCardHeader;