import { toast } from "react-toastify";

export const handleRegister = async (data, setPage, setPhoneNumber, setLoading, setError) => {
    setLoading(true);
    setPhoneNumber(data['phone-number']);
    console.log(data)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber: data['phone-number'],
        }),
    }).then(response => response.json());

    const { status } = response;

    if (status == 409) {
        setError('phone-number', { type: 'manual', message: "کاربری با این شماره تلفن قبلا ثبت نام شده." });
    }

    if (status == 201 || status == 200) {
        setPage(1);
        toast.success("کد تایید به شماره موبایل شما ارسال شد.");
    }

    setLoading(false);
}

export const handleSendOtp = async (otp, setOtp, phoneNumber, setLoading, setError, setPage, setIsOpen, fetchUser, fetchCart) => {
    setLoading(true);

    if (!otp) {
        return setError({ message: "کد تایید را وارد کنید." });
    }
    if (otp.toString().length != 5) {
        return setError({ message: "کد تایید باید 5 رقم باشد." });
    }
    if (typeof parseInt(otp, 10) == 'string') {
        return setError({ message: "کد تایید باید عدد باشد." });
    }
    if (isNaN(otp)) {
        return setError({ message: "کد تایید باید عدد باشد." });
    }
    setError({});

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verifyOtp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber,
            otpCode: otp.toString(),
        }),
        credentials: 'include'
    }).then(response => response.json());

    const { status, message } = response;

    switch (status) {
        case 200:
            fetchUser();
            fetchCart();
            setIsOpen(false);
            setOtp();
            setPage(0);
            toast.success("شما با موفقیت وارد شدید.");
            break;
        case 403:
            setError({ message: "کد تایید نامعتبر یا منقضی شده است." });
            break;
        case 404:
            setError({ message: "کاربری با این شماره تلفن یافت نشد." });
            break;
        default:
            toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
            break;
    }
    setLoading(false);
};

export const handleEditUser = async (body, user, setUser, setLoading) => {

    setLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/editUser/${user._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(response => response.json());

    const { status, user: userData } = response;

    if (status == 404) return toast.error("کاربری با این شماره تلفن یافت نشد.");

    if (status >= 500) return toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

    const newUser = { ...user, ...userData };
    console.log(newUser);

    toast.success("اطلاعات با موفقیت ویرایش شد.");
    setUser(newUser);

    setLoading(false);
};

export const handleLogout = async (clearUser, clearCart, setIsOpenPopup, router) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"
    }).then(res => res.json());

    console.log(response);

    if (response.status >= 500) toast.error("خطای سرور رخ داده است. لطفا دوباره تلاش کنید.");

    setIsOpenPopup(false);
    router.replace("/");
    clearUser();
    clearCart();

    toast.success("با موفقیت از حساب کاربری خود خارج شدید.");
}




// export const handleLikeItem = async (data, setPage, setPhoneNumber, setLoading, setError) => {
//     setLoading(true);
//     setPhoneNumber(data['phone-number']);
//     console.log(data)

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             phoneNumber: data['phone-number'],
//         }),
//     }).then(response => response.json());

//     const { status } = response;

//     if (status == 409) {
//         setError('phone-number', { type: 'manual', message: "کاربری با این شماره تلفن قبلا ثبت نام شده." });
//     }

//     if (status == 201 || status == 200) {
//         setPage(1);
//         toast.success("کد تایید به شماره موبایل شما ارسال شد.");
//     }

//     setLoading(false);
// }