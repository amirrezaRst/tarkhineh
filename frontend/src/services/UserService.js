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