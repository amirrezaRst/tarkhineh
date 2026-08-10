import Image from "next/image";

const OrderFoodItem = ({ image, name, price, count }) => {
    return (
        <div className="xl:h-[190px] lg:h-[165px] md:h-[155px] h-[150px] flex flex-col bg-white border border-border rounded-lg overflow-hidden">
            <div className="relative w-full lg:h-[110px] h-[85px] rounded-t-lg overflow-hidden">
                <Image src={image} alt={name} fill sizes="200px" className="object-cover object-center" />
                <span className="bg-white border border-border absolute bottom-1.5 left-1.5 px-2 rounded-md flex items-center justify-center text-super-sm text-primary">
                    {count}×
                </span>
            </div>
            <div className="h-full flex flex-col gap-1.5 justify-center lg:py-2.5 md:py-1 px-2 text-center md:text-super-sm text-super-xs text-foreground flex-1">
                <h6>{name}</h6>
                <p>{price} تومان</p>
            </div>
        </div>
    );
};

export default OrderFoodItem;
