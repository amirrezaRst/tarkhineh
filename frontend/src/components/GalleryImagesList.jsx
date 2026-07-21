const GalleryItem = ({ index, name, image, selectedImage, setSelectedImage, isBranchGallery }) => {
    return (
        <div
            className={`md:w-[4.5rem] md:h-[4.5rem] w-10 h-10 border-2 rounded-md overflow-hidden transition-all cursor-pointer
                ${index == selectedImage ? "scale-110 border-2 border-border" : "scale-100 border-transparent"}`
            }
            onClick={() => setSelectedImage(index)}
        >
            <img
                src={isBranchGallery ? `/images/${image}` : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`}
                alt={`${name} ترخینه`}
                className="w-full h-full object-center object-cover"
            />
        </div >
    );
}

const GalleryImagesList = ({ name, images, selectedImage, setSelectedImage, isBranchGallery }) => {
    return (
        <div className="w-full absolute bottom-4 flex items-center justify-center lg:gap-7 md:gap-5 gap-2">

            {images.map((image, index) => (
                <GalleryItem key={index} index={index} name={name} image={image} selectedImage={selectedImage} setSelectedImage={setSelectedImage} isBranchGallery={isBranchGallery} />
            ))}

        </div>
    );
}

export default GalleryImagesList;