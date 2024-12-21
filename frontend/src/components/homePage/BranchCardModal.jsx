import { useState } from "react";
import Gallery from "../Gallery";

const BranchCardModal = ({ name, images, setIsOpen }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div
            className="w-[800px] h-[550px] bg-white rounded-lg overflow-hidden"
        >

            <Gallery name={name} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} setIsOpen={setIsOpen} isBranchGallery />

        </div>
    );
}

export default BranchCardModal;