"use client";

import { PenIcon } from "@/assets/Icons";
import ProfileInfoForm from "./ProfileInfoForm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const handleEdit = async (data, setError) => {
        setLoading(true);
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

        // if (status == 409) {
        //     setError('phone-number', { type: 'manual', message: "کاربری با این شماره تلفن قبلا ثبت نام شده." });
        // }

        if (status == 201 || status == 200) {
            toast.success("کد تایید به شماره موبایل شما ارسال شد.");
        }

        setLoading(false);
    }

    return (
        <div className="md:pt-3 pt-0 xl:px-12 lg:px-8 px-2">

            <ProfileInfoForm isEdit={isEdit} register={register} handleSubmit={handleSubmit} handleEdit={handleEdit} />
            <button
                className="md:w-fit w-full flex items-center justify-center gap-2 md:py-2 py-2.5 px-7 border border-[#417F56] rounded-md text-[#417F56] lg:text-base text-super-sm mx-auto md:mt-6 mt-8"
            >
                <PenIcon className="w-5 h-5 fill-[#417F56]" />
                ویرایش اطلاعات شخصی
            </button>

        </div>
    );
}

export default ProfilePage;