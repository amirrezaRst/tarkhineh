import { StarIcon } from "@/assets/Icons";
import PersianNumber from "@/utils/ConvertToPersianNumber";

const faDate = (d) => new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });

const CommentCard = ({ text, rating, user, menuItem, createdAt }) => {
    const name = user?.fullName || "کاربر ترخینه";
    const initial = name.trim().slice(0, 1);

    return (
        <article className="bg-surface border border-border rounded-2xl shadow-soft md:px-5 px-4 md:py-5 py-4">

            <div className="flex items-center gap-3 mb-2.5">
                <div className="shrink-0 w-11 h-11 rounded-full bg-primary-subtle text-primary grid place-items-center text-super-base font-extrabold">
                    {initial}
                </div>

                <div className="min-w-0">
                    <p className="text-super-sm font-semibold text-foreground truncate">{name}</p>
                    <p className="text-super-xs text-subtle-fg tabular-nums">{faDate(createdAt)}</p>
                </div>

                <span className="mr-auto shrink-0 inline-flex items-center gap-1 text-super-sm font-bold text-warning-fg">
                    <StarIcon className="w-4 h-4" />
                    {PersianNumber(rating)}
                </span>
            </div>

            {menuItem?.name &&
                <span className="inline-block bg-primary-subtle text-primary text-super-xs font-bold rounded-full px-2.5 py-0.5 mb-2">
                    دربارهٔ {menuItem.name}
                </span>
            }

            <p className="text-muted-fg md:text-super-sm text-super-xs text-justify leading-7">
                {text}
            </p>

        </article>
    );
}

export default CommentCard;
