const OptionItem = ({ icon, title }) => {
    return (
        <div className="flex flex-col items-center lg:gap-6 gap-4">

            <div className="lg:w-36 lg:h-36 md:w-32 md:h-32 w-28 h-28 flex items-center justify-center border-2 border-[#417F56] rounded-full lg:p-2 md:p-7 p-6">
                {icon}
            </div>

            <h6 className="md:text-lg text-[#353535] text-center leading-7">
                {title}
            </h6>

        </div>
    );
}

export default OptionItem;