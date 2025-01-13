import { HeartIcon, SolidHeartIcon } from "@/assets/Icons";
import { checkLikeStatus, likeMenuItemItem } from "@/services/LikeService";
import { useEffect, useState } from "react";

const MenuCardLike = ({ id, user, setRegisterModal }) => {
    const [isLiked, setIsLiked] = useState(null);

    useEffect(() => {
        checkLikeStatus(user, id, setIsLiked);
    }, [id]);

    const handleLikeMenuItem = () => {
        if (!user) return setRegisterModal(true);
        likeMenuItemItem(user, id, setIsLiked);
    };


    return (
        <button
            className="hover:scale-110 duration-200"
            onClick={handleLikeMenuItem}
        >
            <SolidHeartIcon
                className={`${isLiked === null ? "opacity-0" : isLiked === true ? "block" : "hidden"} md:w-6 md:h-6 w-5 h-5 fill-red-500 stroke-red-500`}
            />
            <HeartIcon
                className={`${isLiked === null ? "opacity-0" : isLiked === false ? "block" : "hidden"} md:w-6 md:h-6 w-5 h-5 stroke-[#717171]`}
            />
        </button>
    );
}

export default MenuCardLike;