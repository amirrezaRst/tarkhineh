import { branchNamesDic, deliveryTypeDic, orderStatusDic } from "@/constant/branchDictionary";

const OrderCardHeader = ({ branch, status, deliveryType }) => {

    const statusStyles = {
        pending: "bg-warning-subtle text-warning-fg",
        preparing: "bg-warning-subtle text-warning-fg",
        on_the_way: "bg-warning-subtle text-warning-fg",
        delivered: "bg-primary-subtle text-primary",
        cancelled: "bg-destructive-subtle text-destructive",
    };

    const badgeClass = statusStyles[status] || "bg-gray-200 text-gray-600";


    return (
        <div className="flex justify-between gap-4">
            <h2 className="md:text-lg text-super-base text-muted-fg font-medium">شعبه {branchNamesDic[branch]}</h2>
            <div className="flex gap-2 md:text-sm text-xs">
                <span className="bg-surface-sunken text-foreground rounded-md py-1.5 md:px-3 px-2">{deliveryTypeDic[deliveryType]}</span>
                <span className={`rounded-md py-1.5 md:px-3 px-2 ${badgeClass}`}>{orderStatusDic[status]}</span>
            </div>
        </div>
    );
}

export default OrderCardHeader;