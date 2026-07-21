import FormField from "@/components/FormField";
import useUserStore from "@/stores/useUserStore";

const AddressForm = ({ register, errors, isMyself, setIsMyself, editPage }) => {
    const user = useUserStore(state => state.user);

    return (
        <>
            <FormField
                placeholder="عنوان آدرس"
                id="title"
                className="w-full mt-3.5 border-muted-fg text-foreground placeholder:text-muted-fg"
                register={register}
                validation={{
                    required: "عنوان آدرس الزامی است.",
                    validate: (value) => {
                        if (value.trim() === "") return "عنوان آدرس نمی‌تواند خالی باشد.";
                        return true;
                    },
                }}
                errors={errors}
            />
            <div className="flex items-center gap-2 mt-3.5">
                <input
                    type="checkbox"
                    id={editPage ? "recipient-is-myself" : "recipient-is-myself2"}
                    className="w-4 h-4"
                    checked={isMyself}
                    onChange={() => setIsMyself(!isMyself)}
                />
                <label
                    htmlFor={editPage ? "recipient-is-myself" : "recipient-is-myself2"}
                    className="text-foreground text-super-sm select-none cursor-pointer"
                >تحویل گیرنده خودم هستم</label>
            </div>

            {isMyself && user.fullName != null ?
                null : isMyself && !user.fullName ?
                    (
                        <FormField
                            placeholder="نام و نام خانوادگی تحویل گیرنده"
                            id="recipientFullName"
                            className="w-full mt-3.5 border-muted-fg text-foreground placeholder:text-muted-fg"
                            register={register}
                            validation={{
                                required: "نام و نام خانوادگی تحویل گیرنده الزامی است.",
                                validate: (value) => {
                                    if (value.trim() === "") return "نام و نام خانوادگی نمی‌تواند خالی باشد.";
                                    return true;
                                },
                            }}
                            errors={errors}
                        />
                    ) : !isMyself &&
                    (
                        <>
                            <FormField
                                placeholder="نام و نام خانوادگی تحویل گیرنده"
                                id="recipientFullName"
                                className="w-full mt-3.5 border-muted-fg text-foreground placeholder:text-muted-fg"
                                register={register}
                                validation={{
                                    required: "نام و نام خانوادگی تحویل گیرنده الزامی است.",
                                    validate: (value) => {
                                        if (value.trim() === "") return "نام و نام خانوادگی نمی‌تواند خالی باشد.";
                                        return true;
                                    },
                                }}
                                errors={errors}
                            />
                            <FormField
                                placeholder="شماره همراه تحویل گیرنده"
                                id="recipientPhoneNumber"
                                type="text"
                                className="w-full mt-3.5 border-muted-fg text-foreground placeholder:text-muted-fg"
                                register={register}
                                validation={{
                                    required: "شماره همراه تحویل گیرنده الزامی است.",
                                    pattern: {
                                        value: /^09\d{9}$/,
                                        message: "شماره همراه باید 11 رقم و با 09 شروع شود.",
                                    },
                                    minLength: {
                                        value: 11,
                                        message: "شماره همراه باید دقیقا 11 رقم باشد.",
                                    },
                                    maxLength: {
                                        value: 11,
                                        message: "شماره همراه باید دقیقا 11 رقم باشد.",
                                    },
                                }}
                                errors={errors}
                            />
                        </>
                    )
            }


            <FormField
                placeholder="آدرس"
                id="addressLine"
                className="w-full mt-3.5 border-muted-fg text-foreground placeholder:text-muted-fg"
                register={register}
                validation={{
                    required: "آدرس الزامی است.",
                    validate: (value) => {
                        if (value.trim() === "") return "آدرس نمی‌تواند خالی باشد.";
                        return true;
                    },
                }}
                errors={errors}
                textarea
            />
        </>
    );
}

export default AddressForm;