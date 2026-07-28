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

// Reading the like state is a passive, per-card background check: a logged-out
// visitor simply has no likes, and a failure here must stay silent — otherwise
// every card on the page fires its own error toast.
export const checkLikeStatus = async (userId, itemId, setIsLiked) => {
    if (!userId) return setIsLiked(false);
    try {
        const { liked } = await api.get(`/like/status/${userId}/${itemId}`);
        setIsLiked(!!liked);
    } catch {
        setIsLiked(false);
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
