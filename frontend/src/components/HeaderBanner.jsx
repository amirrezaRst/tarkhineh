const HeaderBanner = ({ title, imageSrc }) => {
    return (
        <div
            className={`w-full xl:h-[400px] lg:h-[350px] md:h-[300px] h-[180px] bg-center bg-cover flex items-center justify-center`}
            style={{ backgroundImage: `url(${imageSrc})` }}
        >
            <h1 className="text-primary-subtle xl:text-4xl lg:text-3xl md:text-2xl text-1.5xl font-semibold">
                {title}
            </h1>
        </div>
    );
}

export default HeaderBanner;