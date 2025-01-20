import FormField from "@/components/FormField";

const ProfileInfoForm = ({ isEdit, register, handleSubmit, handleEdit }) => {
    return (
        <form
            className="grid md:grid-cols-2 gap-x-4 md:gap-y-5 gap-y-4"
            onSubmit={handleSubmit((data) => handleEdit(data))}
        >
            <FormField
                placeholder="نام"
                disabled={!isEdit}
            />
            <FormField
                placeholder="نام خانوادگی"
                disabled={!isEdit}
            />
            <FormField
                placeholder="آدرس ایمیل" type="email"
                disabled={!isEdit}
            />
            <FormField
                placeholder="تلفن همراه"
                disabled={!isEdit}
            />
            <FormField
                placeholder="تاریخ تولد (اختیاری)"
                disabled={!isEdit}
            />
            <FormField
                placeholder="نام نمایشی"
                disabled={!isEdit}
            />
        </form>
    );
}

export default ProfileInfoForm;