const FormField = ({ type = "text", className, placeholder }) => {
    return (
        <input
            type={type}
            className={`py-2.5 px-4 border border-[#CBCBCB] rounded-md md:text-base text-super-sm text-[#717171] placeholder:text-[#717171] h-fit ${className}`}
            placeholder={placeholder}
        />
    );
}

export default FormField;