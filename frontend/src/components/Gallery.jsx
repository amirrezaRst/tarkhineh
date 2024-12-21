import { XmarkIcon } from "@/assets/Icons";
import GalleryImagesList from "./GalleryImagesList";

const Gallery = ({ name, images, selectedImage, setSelectedImage, setIsOpen, isBranchGallery }) => {
    console.log(images[selectedImage])
    return (
        <div className="relative w-full h-full">
            {isBranchGallery &&
                <XmarkIcon
                    className="fill-white md:w-8 md:h-8 w-7 h-7 absolute left-4 top-3 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
            }
            <img
                src={isBranchGallery ? `/images/${images[selectedImage]}` : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[selectedImage]}`}
                alt={`${name} ترخینه`}
                className="w-full h-full object-center object-cover"
            />

            {/* Images List */}
            <GalleryImagesList name={name} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} isBranchGallery={isBranchGallery} />

        </div>
    );
}

export default Gallery;