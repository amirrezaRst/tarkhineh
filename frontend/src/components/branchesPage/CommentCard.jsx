import { StarIcon } from "@/assets/Icons";

const faDate = (d) => new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });

const CommentCard = ({ text, rating, user, menuItem, createdAt }) => {
    const name = user?.fullName || "کاربر ترخینه";
    const initials = name.trim().slice(0, 1);

    return (
        <div
            className="lg:w-[550px] md:w-[500px] w-[300px] flex-shrink-0 bg-white flex md:flex-row flex-col md:items-center gap-4 border border-border rounded-lg md:p-6 py-4 px-3"
        >

            {/*// User Info */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex md:flex-col items-center justify-center md:gap-2 gap-3.5">
                    <div className="md:w-[5.2rem] md:h-[5.2rem] w-16 h-16 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xl font-bold">
                        {initials}
                    </div>

                    <div className="flex flex-col md:items-center items-start gap-1 md:text-super-sm text-super-xs text-muted-fg">
                        <p>{name}</p>
                        <p className="md:text-super-sm text-xs">{faDate(createdAt)}</p>
                    </div>
                </div>
                <div className="md:hidden flex items-center gap-0.5">
                    <StarIcon className="w-5 h-5" /> <span className="font-medium">{rating}</span>
                </div>
            </div>

            <div className="relative w-full h-full flex-1 flex flex-col justify-center">
                {menuItem?.name &&
                    <p className="text-super-xs text-primary font-semibold mb-1.5">دربارهٔ {menuItem.name}</p>
                }
                <p className="text-foreground md:text-super-sm text-super-xs text-justify md:leading-6">
                    {text}
                </p>

                <div className="md:flex hidden items-center gap-0.5 absolute bottom-0 left-0">
                    <StarIcon className="w-5 h-5" /> <span className="font-medium">{rating}</span>
                </div>
            </div>

        </div>
    );
}

export default CommentCard;
