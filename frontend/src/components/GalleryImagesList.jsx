const GalleryItem = ({ index, name, image, selectedImage, setSelectedImage, isBranchGallery }) => {
    return (
        <div
            className={`w-[4.5rem] h-[4.5rem] border-2 rounded-md overflow-hidden transition-all cursor-pointer
                ${index == selectedImage ? "scale-110 border-2 border-[#e1e1e1]" : "scale-100 border-transparent"}`
            }
            onClick={() => setSelectedImage(index)}
        >
            <img
                src={isBranchGallery?`/images/${image}`:`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`}
                alt={`${name} ترخینه`}
                className="w-full h-full object-center object-cover"
            />
        </div >
    );
}

const GalleryImagesList = ({ name, images, selectedImage, setSelectedImage, isBranchGallery }) => {
    return (
        <div className="w-full absolute bottom-4 flex items-center justify-center gap-7">

            {images.map((image, index) => (
                <GalleryItem key={index} index={index} name={name} image={image} selectedImage={selectedImage} setSelectedImage={setSelectedImage} isBranchGallery />
            ))}

        </div>
    );
}

export default GalleryImagesList;