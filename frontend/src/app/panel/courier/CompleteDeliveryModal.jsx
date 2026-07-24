"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/panel/Modal";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { completeDelivery } from "@/services/CourierService";
import { shortId } from "./courierClientUtils";

const LEN = 4;
// Normalise Persian/Arabic digits to ASCII.
const toAscii = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

const CompleteDeliveryModal = ({ open, onClose, order, onCompleted }) => {
    const [digits, setDigits] = useState(Array(LEN).fill(""));
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const refs = useRef([]);

    useEffect(() => {
        if (open) {
            setDigits(Array(LEN).fill(""));
            setDone(false);
            setTimeout(() => refs.current[0]?.focus(), 50);
        }
    }, [open]);

    const setAt = (i, v) => setDigits((d) => { const n = [...d]; n[i] = v; return n; });

    const onChange = (i, raw) => {
        const v = toAscii(raw).replace(/\D/g, "");
        if (!v) { setAt(i, ""); return; }
        // support paste of the full code
        if (v.length > 1) {
            const arr = v.slice(0, LEN).split("");
            setDigits(Array.from({ length: LEN }, (_, k) => arr[k] || ""));
            refs.current[Math.min(arr.length, LEN - 1)]?.focus();
            return;
        }
        setAt(i, v);
        if (i < LEN - 1) refs.current[i + 1]?.focus();
    };

    const onKeyDown = (i, e) => {
        if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    };

    const code = digits.join("");
    const submit = async () => {
        if (code.length !== LEN) return;
        setBusy(true);
        const ok = await completeDelivery(order._id, code, () => { });
        setBusy(false);
        if (ok) { setDone(true); onCompleted?.(); }
        else { setDigits(Array(LEN).fill("")); refs.current[0]?.focus(); }
    };

    if (!order) return null;

    return (
        <Modal open={open} onClose={onClose} size="sm">
            {done ? (
                <div className="p-8 text-center">
                    <div className="w-[72px] h-[72px] rounded-full bg-primary-subtle text-primary grid place-items-center mx-auto mb-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <h2 className="text-lg font-extrabold">تحویل با موفقیت ثبت شد</h2>
                    <p className="text-super-sm text-muted-fg mt-2">سفارش #{shortId(order._id)} تحویل داده شد و به تاریخچهٔ شما اضافه گردید.</p>
                    <button onClick={onClose} className="mt-6 w-full bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover min-h-[48px]">باشه</button>
                </div>
            ) : (
                <div className="p-6 text-center">
                    <div className="w-[60px] h-[60px] rounded-[18px] bg-primary-subtle text-primary grid place-items-center mx-auto mb-3.5">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    </div>
                    <h2 className="text-lg font-extrabold">کد تحویل مشتری</h2>
                    <p className="text-super-sm text-muted-fg mt-2 leading-6">کد ۴ رقمی را از مشتری بگیرید و وارد کنید.<br />مشتری این کد را در اپلیکیشن خود می‌بیند.</p>
                    <span className="inline-block bg-primary-subtle text-primary font-extrabold text-super-xs px-3 py-1.5 rounded-full mt-3">
                        سفارش #{shortId(order._id)}{order.user?.fullName ? ` · ${order.user.fullName}` : ""}
                    </span>

                    <div className="flex justify-center gap-3 my-6" dir="ltr">
                        {digits.map((d, i) => (
                            <input
                                key={i}
                                ref={(el) => (refs.current[i] = el)}
                                value={PersianNumber(d)}
                                onChange={(e) => onChange(i, e.target.value)}
                                onKeyDown={(e) => onKeyDown(i, e)}
                                inputMode="numeric"
                                maxLength={i === 0 ? LEN : 1}
                                aria-label={`رقم ${i + 1} کد تحویل`}
                                className={`w-14 h-16 text-center text-2xl font-extrabold tabular-nums rounded-2xl border-2 bg-surface outline-none transition-all ${d ? "border-primary ring-4 ring-primary-subtle text-primary" : "border-border-strong focus:border-primary focus:ring-4 focus:ring-primary-subtle"}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2.5">
                        <button onClick={onClose} className="flex-1 bg-surface-sunken text-muted-fg rounded-xl py-3 text-super-sm font-bold min-h-[48px]">انصراف</button>
                        <button onClick={submit} disabled={busy || code.length !== LEN}
                            className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50 min-h-[48px]">
                            {busy ? "در حال ثبت…" : "تایید تحویل"}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CompleteDeliveryModal;
