const FormField = ({ id, type = "text", className, placeholder, register, validation, errors, disabled, textarea, row }) => {
    return (
        !textarea ?
            register ?
                <>
                    <input
                        type={type}
                        className={`bg-transparent py-[0.57rem] px-4 border border-[#CBCBCB] disabled:border-[#CBCBCB]/60 rounded-md md:text-base text-super-sm text-[#717171] placeholder:text-[#717171] disabled:placeholder:text-[#CBCBCB] h-fit ${className}`}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...register(id, validation)}
                    />
                    {errors[id] && (
                        <span className="text-red-600 block text-sm mt-1.5">{errors[id].message}</span>
                    )}
                </> :
                <>
                    <input
                        type={type}
                        className={`bg-transparent py-[0.57rem] px-4 border border-[#CBCBCB] disabled:border-[#CBCBCB]/60 rounded-md md:text-base text-super-sm text-[#717171] placeholder:text-[#717171] disabled:placeholder:text-[#CBCBCB] h-fit ${className}`}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </> :
            <>
                <textarea
                    type={type}
                    className={`bg-transparent py-[0.57rem] px-4 border border-[#CBCBCB] disabled:border-[#CBCBCB]/60 rounded-md md:text-base text-super-sm text-[#717171] placeholder:text-[#717171] disabled:placeholder:text-[#CBCBCB] ${className}`}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...register(id, validation)}
                    rows={row || 4}
                ></textarea>

            </>
    );
}

export default FormField;