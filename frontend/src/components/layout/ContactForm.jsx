"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

const MAX_LEN = 200;

const ContactForm = () => {
    const [form, setForm] = useState({ fullName: "", phoneNumber: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.fullName.trim() || !form.phoneNumber.trim() || !form.message.trim()) {
            return toast.error("لطفاً نام، شماره تماس و متن پیام را وارد کنید.");
        }
        setLoading(true);
        try {
            await api.post("/contact", form);
            toast.success("پیام شما با موفقیت ارسال شد.");
            setForm({ fullName: "", phoneNumber: "", email: "", message: "" });
        } catch (err) {
            toast.error(err?.message || "خطایی در ارسال پیام رخ داد.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="grid md:grid-cols-2 gap-4">

                <div className="space-y-3">
                    <input
                        type="text"
                        value={form.fullName}
                        onChange={set("fullName")}
                        placeholder="نام و نام خانوادگی"
                        className="bg-transparent w-full backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background focus:outline-none"
                    />
                    <input
                        type="text"
                        value={form.phoneNumber}
                        onChange={set("phoneNumber")}
                        placeholder="شماره تماس"
                        dir="ltr"
                        className="bg-transparent w-full backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background text-left focus:outline-none"
                    />
                    <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="آدرس ایمیل (اختیاری)"
                        dir="ltr"
                        className="bg-transparent w-full backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background text-left focus:outline-none"
                    />
                </div>

                <textarea
                    value={form.message}
                    onChange={set("message")}
                    maxLength={MAX_LEN}
                    placeholder="پیام شما"
                    className="bg-transparent w-full md:h-full h-40 backdrop-blur-sm border border-muted-fg rounded-lg py-2.5 px-5 text-sm placeholder:text-background text-background focus:outline-none resize-none"
                />

            </div>

            <p className="text-sm text-border mt-2 text-left">{form.message.length}/{MAX_LEN}</p>
            <button
                type="submit"
                disabled={loading}
                className="text-background text-super-sm border border-muted-fg rounded-lg float-left mt-2 py-2.5 px-16 disabled:opacity-60"
            >
                {loading ? "در حال ارسال..." : "ارسال پیام"}
            </button>
        </form>
    );
};

export default ContactForm;
