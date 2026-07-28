import { HeartIcon, SolidHeartIcon } from "@/assets/Icons";
import { checkLikeStatus, likeMenuItemItem } from "@/services/LikeService";
import { useEffect, useState } from "react";

const MenuCardLike = ({ id, user, setRegisterModal, floating }) => {
    const [isLiked, setIsLiked] = useState(null);

    // `user` starts undefined until the store hydrates, so re-check once it
    // arrives rather than firing a request with an undefined id.
    useEffect(() => {
        checkLikeStatus(user, id, setIsLiked);
    }, [id, user]);

    const handleLikeMenuItem = () => {
        if (!user) return setRegisterModal(true);
        likeMenuItemItem(user, id, setIsLiked);
    };

    // `floating` sits the button on top of a card image as a circular chip.
    const cls = floating
        ? "w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm grid place-items-center shadow-soft hover:scale-110 duration-200"
        : "hover:scale-110 duration-200";

    return (
        <button
            className={cls}
            aria-label="افزودن به علاقه‌مندی‌ها"
            onClick={handleLikeMenuItem}
        >
            <SolidHeartIcon
                className={`${isLiked === null ? "opacity-0" : isLiked === true ? "block" : "hidden"} md:w-6 md:h-6 w-5 h-5 fill-red-500 stroke-red-500`}
            />
            <HeartIcon
                className={`${isLiked === null ? "opacity-0" : isLiked === false ? "block" : "hidden"} md:w-6 md:h-6 w-5 h-5 stroke-muted-fg`}
            />
        </button>
    );
}

export default MenuCardLike;
