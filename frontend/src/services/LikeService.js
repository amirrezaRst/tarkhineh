import { toast } from "react-toastify";

export const likeMenuItemItem = async (user, menuItem, setIsLiked) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/like`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
            user,
            menuItem
        }),
    }).then(res => res.json());

    const { status } = response;

    if (status != 201 && status != 200) return toast("خطایی رخ داده است. لطفا دوباره تلاش کنید.")

    checkLikeStatus(user, menuItem, setIsLiked)
}


export const checkLikeStatus = async (userId, itemId, setIsLiked) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/status/${userId}/${itemId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"
    }).then(res => res.json());

    const { status, liked } = response;

    if (status === 500) return toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.")

    if (liked === true) return setIsLiked(true);
    if (liked === false) return setIsLiked(false);
}


export const fetchInterestItems = async (userId, category, setItems) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/userLikes/${userId}?category=${category == "all" ? "" : category}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    }).then(res => res.json());

    const { status, likes } = response;

    console.log(likes)

    if (status === 500) return toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.")
    setItems(likes);
}