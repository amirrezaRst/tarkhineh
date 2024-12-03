const FormField = ({ type = "text", className, placeholder, disabled }) => {
    return (
        <input
            type={type}
            className={`bg-transparent py-[0.57rem] px-4 border border-[#CBCBCB] disabled:border-[#CBCBCB]/60 rounded-md md:text-base text-super-sm text-[#717171] placeholder:text-[#717171] disabled:placeholder:text-[#CBCBCB] h-fit ${className}`}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}

export default FormField;