import { toast } from "react-toastify";

export const handleDeleteAddress = async (userId, index, setIsOpen, setUser) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deleteAddress/${userId}/${index}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    const { status, user } = response;

    setUser(user);


    if (status === 500 || status === 404) return toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.")


    toast.success("آدرس با موفقیت حذف شد.")
    setIsOpen(false);
}


export const handleEditAddress = async (userId, index, body, setIsOpen, setUser) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/editAddress/${userId}/${index}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            body
        )
    }).then(res => res.json());

    const { status, message, user } = response;

    if (status == 404) return toast.error("کاربر مورد نظر یافت نشد.");
    if (status == 400) return toast.error("آدرس مورد نظر یافت نشد.");

    if (status === 500) return toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.")

    setUser(user)
    toast.success("آدرس با موفقیت به روزرسانی شد.");

    setIsOpen(false);
}

export const handleNewAddress = async (userId, body, setIsOpen, setUser) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/newAddress/${userId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            body
        )
    }).then(res => res.json());

    const { status, message, user } = response;

    if (status == 404) return toast.error("کاربر مورد نظر یافت نشد.");

    if (status === 500) return toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.")

    setUser(user)
    toast.success("آدرس جدید با موفقیت اضافه شد.");

    setIsOpen(false);
}