import { useState } from "react";
import Gallery from "../Gallery";

const BranchCardModal = ({ name, images, setIsOpen }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div
            className="xl:w-[800px] max-w-[90%] w-full mx-auto lg:h-[550px] md:h-[500px] h-[330px] bg-white rounded-2xl overflow-hidden"
        >

            <Gallery name={name} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} setIsOpen={setIsOpen} isBranchGallery />

        </div>
    );
}

export default BranchCardModal;