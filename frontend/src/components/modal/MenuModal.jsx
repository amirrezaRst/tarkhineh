"use client";

import { useEffect, useState } from "react";
import { StarIcon, OutlineStarIcon, XmarkIcon } from "@/assets/Icons";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import FormatPrice from "@/utils/FormatPrice";
import { fetchMenuReviews } from "@/services/MenuService";
import ModalGallery from "./ModalGallery";
import CartButton from "../menusPage/CartButton";

const CAT_LABEL = { main: "غذای اصلی", side: "پیش‌غذا", dessert: "دسر", drink: "نوشیدنی" };
const FOOD_TYPE_LABEL = { iranian: "ایرانی", "non-iranian": "غیرایرانی", pizza: "پیتزا", sandwich: "ساندویچ" };

const PAGE_SIZE = 5;
const faDate = (d) => new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });

const Stars = ({ rate = 0, size = "w-4 h-4" }) => (
    <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) =>
            n <= Math.round(rate)
                ? <StarIcon key={n} className={size} />
                : <OutlineStarIcon key={n} className={`${size} opacity-40`} />
        )}
    </span>
);

const MenuModal = ({
    _id, name, images, ingredients, description, reviews, available,
    price, discount, finalPrice, category, foodType, isPersian,
    handleAddToCart, handleDecrease, loading, setLoading, setIsOpen,
}) => {
    const [tab, setTab] = useState("info");
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);      // pages already loaded
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(reviews?.total ?? 0);
    const [dist, setDist] = useState(null);   // spread over every approved review
    const [busy, setBusy] = useState(false);

    const outOfStock = available === false;
    const rate = reviews?.averageRating;

    // Reviews load lazily: the count next to the tab already comes from the
    // item payload, so nothing is fetched until the tab is actually opened.
    const loadPage = async (next) => {
        setBusy(true);
        const res = await fetchMenuReviews(_id, next, PAGE_SIZE);
        setBusy(false);
        if (!res) return;
        setList((cur) => (next === 1 ? res.reviews : [...cur, ...res.reviews]));
        setPage(res.page);
        setPages(res.pages);
        setTotal(res.total);
        setDist(res.distribution);
    };

    useEffect(() => {
        if (tab === "reviews" && page === 0) loadPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const catLabel = [CAT_LABEL[category], FOOD_TYPE_LABEL[foodType] || (isPersian === true ? "ایرانی" : isPersian === false ? "غیرایرانی" : null)]
        .filter(Boolean).join(" · ");

    const badge = outOfStock
        ? { text: "ناموجود", tone: "danger" }
        : discount
            ? {
                text: discount.discountType === "percentage"
                    ? `${PersianNumber(discount.discountValue)}٪ تخفیف`
                    : `${FormatPrice(discount.discountValue)} تومان تخفیف`,
                tone: "brand",
            }
            : null;

    return (
        <div className="w-[min(880px,92vw)] max-h-[90vh] bg-surface rounded-3xl overflow-y-auto md:overflow-hidden shadow-soft-lg grid md:grid-cols-2">

            <ModalGallery name={name} images={images} badge={badge} />

            <div className="flex flex-col min-h-0 md:px-6 px-4 pt-5">

                {/* header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {catLabel &&
                            <span className="inline-block bg-primary-subtle text-primary text-super-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                                {catLabel}
                            </span>
                        }
                        <h2 className="md:text-2xl text-xl font-extrabold text-foreground">{name}</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="بستن"
                        className="shrink-0 w-9 h-9 rounded-full border border-border text-muted-fg grid place-items-center hover:bg-surface-sunken hover:text-foreground hover:rotate-90 duration-200"
                    >
                        <XmarkIcon className="w-4 h-4 fill-current" />
                    </button>
                </div>

                {/* rating */}
                <div className="flex items-center gap-2 mt-2.5">
                    <Stars rate={rate} />
                    <b className="text-super-sm tabular-nums">{rate ? PersianNumber(rate) : "—"}</b>
                    <span className="text-super-xs text-subtle-fg tabular-nums">
                        ({PersianNumber(total)} نظر)
                    </span>
                </div>

                {/* tabs */}
                <div className="flex gap-0.5 mt-3.5 border-b border-border" role="tablist">
                    <TabButton active={tab === "info"} onClick={() => setTab("info")}>جزئیات</TabButton>
                    <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
                        نظرات
                        <span className={`mr-1.5 rounded-full px-1.5 text-super-xs tabular-nums ${tab === "reviews" ? "bg-primary-subtle" : "bg-surface-sunken"}`}>
                            {PersianNumber(total)}
                        </span>
                    </TabButton>
                </div>

                {/* panel */}
                <div className="md:flex-1 md:min-h-0 md:overflow-y-auto md:max-h-none max-h-[260px] overflow-y-auto">
                    {tab === "info"
                        ? <InfoPanel description={description} ingredients={ingredients} />
                        : <ReviewsPanel
                            list={list} total={total} page={page} pages={pages} busy={busy} dist={dist}
                            onMore={() => loadPage(page + 1)}
                        />
                    }
                </div>

                {/* action bar */}
                <div className="mt-auto sticky bottom-0 bg-surface border-t border-border pt-3.5 pb-5">
                    {outOfStock &&
                        <p className="bg-destructive-subtle text-destructive text-super-xs font-bold text-center rounded-xl py-2 px-3.5 mb-3">
                            این آیتم در حال حاضر موجود نیست.
                        </p>
                    }
                    <div className="flex items-center justify-between gap-3.5">
                        <div className="min-w-0">
                            {discount &&
                                <div className="flex items-center gap-1.5">
                                    <s className="text-super-xs text-subtle-fg tabular-nums">{FormatPrice(price)} تومان</s>
                                    <span className="bg-destructive-subtle text-destructive text-super-xs font-bold rounded-full px-1.5 tabular-nums">
                                        {discount.discountType === "percentage"
                                            ? `${PersianNumber(discount.discountValue)}٪`
                                            : PersianNumber(discount.discountValue)}
                                    </span>
                                </div>
                            }
                            <div className="text-2xl font-extrabold tabular-nums leading-tight">
                                {FormatPrice(finalPrice ?? price)}
                                <span className="text-super-xs font-normal text-muted-fg mr-1.5">تومان</span>
                            </div>
                        </div>

                        <div className="shrink-0 md:w-[190px] w-[150px] -mt-4">
                            <CartButton
                                id={_id}
                                handleAddToCart={handleAddToCart}
                                handleDecrease={handleDecrease}
                                setLoading={setLoading}
                                loading={loading}
                                disabled={outOfStock}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, children }) => (
    <button
        role="tab"
        aria-selected={active}
        onClick={onClick}
        className={`relative px-3.5 py-2.5 text-super-sm font-bold duration-200 ${active ? "text-primary" : "text-muted-fg hover:text-foreground"}`}
    >
        {children}
        <span className={`absolute bottom-0 inset-x-3.5 h-[2.5px] rounded-t bg-primary duration-200 ${active ? "scale-x-100" : "scale-x-0"}`} />
    </button>
);

const InfoPanel = ({ description, ingredients }) => (
    <>
        {description &&
            <section className="py-3.5 border-b border-border">
                <h4 className="text-super-xs font-bold text-subtle-fg mb-2">توضیحات</h4>
                <p className="text-super-sm text-muted-fg leading-8">{description}</p>
            </section>
        }
        {ingredients?.length > 0 &&
            <section className="py-3.5">
                <h4 className="text-super-xs font-bold text-subtle-fg mb-2.5">مواد تشکیل‌دهنده</h4>
                <div className="flex flex-wrap gap-2">
                    {ingredients.map((it, i) => (
                        <span key={i} className="bg-surface-sunken border border-border text-foreground text-super-xs rounded-full px-3 py-1">
                            {it}
                        </span>
                    ))}
                </div>
            </section>
        }
    </>
);

const ReviewsPanel = ({ list, total, page, pages, busy, dist, onMore }) => {
    if (busy && !list.length) return <p className="text-center text-muted-fg text-super-sm py-10">در حال بارگذاری نظرات…</p>;

    if (!list.length) return (
        <div className="text-center py-10 px-3">
            <p className="text-super-sm text-muted-fg">هنوز نظری برای این غذا ثبت نشده است.</p>
            <p className="text-super-xs text-subtle-fg mt-1">اولین نفری باشید که تجربه‌اش را می‌نویسد.</p>
        </div>
    );

    const spread = dist || [0, 0, 0, 0, 0];

    return (
        <>
            {/* spread comes from the server over every approved review, so it
                stays correct no matter how many pages have been loaded */}
            <div className="grid gap-1.5 py-3.5 border-b border-border">
                {[5, 4, 3, 2, 1].map((n) => {
                    const count = spread[n - 1];
                    const pct = total ? (count / total) * 100 : 0;
                    return (
                        <div key={n} className="flex items-center gap-2 text-super-xs text-muted-fg">
                            <span className="tabular-nums">{PersianNumber(n)}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                                <div className="h-full rounded-full bg-warning" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="tabular-nums">{PersianNumber(count)}</span>
                        </div>
                    );
                })}
            </div>

            {list.map((r) => {
                const who = r.user?.fullName || "کاربر ترخینه";
                return (
                    <div key={r._id} className="flex gap-3 py-3.5 border-b border-border last:border-b-0">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-primary-subtle text-primary grid place-items-center font-extrabold text-super-sm">
                            {who.trim().slice(0, 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-super-xs font-bold">{who}</span>
                                <span className="text-super-xs text-subtle-fg tabular-nums">{faDate(r.createdAt)}</span>
                                <span className="mr-auto"><Stars rate={r.rating} size="w-3.5 h-3.5" /></span>
                            </div>
                            <p className="text-super-xs text-muted-fg leading-7 mt-1">{r.text}</p>
                        </div>
                    </div>
                );
            })}

            {page < pages &&
                <div className="py-3.5 text-center">
                    <button
                        onClick={onMore}
                        disabled={busy}
                        className="border border-primary text-primary hover:bg-primary-subtle rounded-xl px-5 py-2 text-super-xs font-bold duration-200 disabled:opacity-50"
                    >
                        {busy
                            ? "در حال بارگذاری…"
                            : `نمایش نظرات بیشتر (${PersianNumber(total - list.length)} مورد)`}
                    </button>
                </div>
            }
        </>
    );
};

export default MenuModal;
