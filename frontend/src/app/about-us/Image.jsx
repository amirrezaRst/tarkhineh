import NextImage from "next/image";

const Image = () => {
    return (
        <div className="xl:col-span-1 lg:col-span-5 lg:order-2 -order-1 w-full rounded-lg overflow-hidden">
            <NextImage src="/images/about-image.jpg" alt="Image" width={1200} height={984} className="w-full h-auto" />
        </div>
    );
}

export default Image;