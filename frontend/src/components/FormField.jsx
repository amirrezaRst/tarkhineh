const FormField = ({ id, type = "text", className, placeholder, register, validation, errors, disabled, textarea, row }) => {
    return (
        !textarea ?
            register ?
                <div className="w-full">
                    <input
                        type={type}
                        className={`bg-transparent py-[0.57rem] px-4 border border-border disabled:border-border/60 rounded-md md:text-base text-super-sm text-muted-fg placeholder:text-muted-fg disabled:placeholder:text-border w-full h-fit ${className}`}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...register(id, validation)}
                    />
                    {errors[id] && (
                        <span className="text-red-600 block text-sm mt-1.5">{errors[id].message}</span>
                    )}
                </div> :
                <>
                    <input
                        type={type}
                        className={`bg-transparent py-[0.57rem] px-4 border border-border disabled:border-border/60 rounded-md md:text-base text-super-sm text-muted-fg placeholder:text-muted-fg disabled:placeholder:text-border w-full h-fit ${className}`}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </> :
            <>
                <textarea
                    type={type}
                    className={`bg-transparent py-[0.57rem] px-4 border border-border disabled:border-border/60 rounded-md md:text-base text-super-sm text-muted-fg placeholder:text-muted-fg disabled:placeholder:text-border ${className}`}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...register(id, validation)}
                    rows={row || 4}
                ></textarea>

            </>
    );
}

export default FormField;