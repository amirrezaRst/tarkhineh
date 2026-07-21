"use client";

import { PenIcon } from "@/assets/Icons";
import ProfileInfoForm from "./ProfileInfoForm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUserStore from "@/stores/useUserStore";
import { handleEditUser } from "@/services/UserService";

const ProfilePage = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm(user ? {
        defaultValues: {
            "fullName": user && user?.fullName,
            "email": user && user?.email,
            "phone": user && user?.phoneNumber,
            "userName": user && user?.userName,
        }
    } : {});

    useEffect(() => {
        cancelHandler();
    }, [user])

    const editHandler = async (data) => {
        const body = {
            fullName: data.fullName,
        }
        data.email && (body.email = data.email);
        data.userName && (body.userName = data.userName);

        handleEditUser(body, user, setUser, setLoading);
    };

    const cancelHandler = () => {
        setIsEdit(false);
        reset({
            "fullName": user && user?.fullName,
            "email": user && user?.email,
            "phone": user && user?.phoneNumber,
            "userName": user && user?.userName,
        });
    };

    return (
        <form
            className="md:pt-3 pt-0 xl:px-12 lg:px-8 px-2"
            onSubmit={handleSubmit(data => editHandler(data))}
        >

            {user ?
                <ProfileInfoForm
                    isEdit={isEdit}
                    register={register}
                    errors={errors}
                // user={user}
                // handler={handleEdit}
                /> :
                <div
                    className="grid md:grid-cols-2 gap-x-4 md:gap-y-5 gap-y-4"
                >
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className={`animate-pulse bg-subtle-fg py-[0.57rem] px-4 rounded-md md:text-base text-super-sm h-12`}
                        />
                    ))}
                </div>
            }

            {
                isEdit ? (
                    <div className="">
                        <button
                            className={`bg-primary flex items-center justify-center gap-2 md:py-2 py-2.5 px-7 border border-primary rounded-md text-white lg:text-base text-super-sm mx-auto md:mt-6 mt-8 float-left mr-5 disabled:bg-subtle-fg`}
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "در حال ویرایش..." : "ثبت تغییرات"}
                        </button>
                        <button
                            className=" flex items-center justify-center gap-2 md:py-2 py-2.5 px-7 border border-primary rounded-md text-primary lg:text-base text-super-sm mx-auto md:mt-6 mt-8 float-left"
                            onClick={cancelHandler}
                        >
                            انصراف
                        </button>
                    </div>
                )
                    :
                    <button
                        className="md:w-fit w-full flex items-center justify-center gap-2 md:py-2 py-2.5 px-7 border border-primary rounded-md text-primary lg:text-base text-super-sm mx-auto md:mt-6 mt-8"
                        onClick={() => setIsEdit(true)}
                    >
                        <PenIcon className="w-5 h-5 fill-primary" />
                        ویرایش اطلاعات شخصی
                    </button>
            }

        </form>
    );
}

export default ProfilePage;