import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const likeMenuItemItem = async (user, menuItem, setIsLiked) => {
    try {
        await api.post("/like/like", { user, menuItem });
        checkLikeStatus(user, menuItem, setIsLiked);
    } catch {
        toast("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
};

export const checkLikeStatus = async (userId, itemId, setIsLiked) => {
    try {
        const { liked } = await api.get(`/like/status/${userId}/${itemId}`);
        setIsLiked(!!liked);
    } catch {
        toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
};

export const fetchInterestItems = async (userId, category, setItems) => {
    try {
        const { likes } = await api.get(`/like/userLikes/${userId}?category=${category === "all" ? "" : category}`);
        setItems(likes);
    } catch {
        toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
};
