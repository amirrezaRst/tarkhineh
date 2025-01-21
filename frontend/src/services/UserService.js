import { toast } from "react-toastify";

export const handleRegister = async (data, setPage, setPhoneNumber, setLoading, setError) => {
    setLoading(true);
    setPhoneNumber(data['phone-number']);
    console.log(data)
logoutHandler
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