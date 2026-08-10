import Image from "next/image";
import FormField from "@/components/FormField";

const AddressForm = () => {
    return (
        <>
            <p className="lg:text-xl md:text-lg md:font-normal font-medium text-foreground md:mb-4 mb-6">
                آدرس ملک متقاضی
            </p>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-x-6 lg:gap-y-1 md:gap-y-5 gap-y-3.5 mb-12">

                <FormField placeholder="استان" className={"-order-1"} />
                <FormField placeholder="شهر" className={"-order-1"} />

                <div className="relative flex lg:col-span-1 md:col-span-2 md:row-span-2 bg-red-400 lg:-order-1 order-1">
                    <Image src="/images/map-image.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                </div>

                <FormField placeholder="منطقه" className={"-order-1"} />
                <FormField placeholder="آدرس دقیق" className={"-order-1"} />

            </div>
        </>
    );
}

export default AddressForm;