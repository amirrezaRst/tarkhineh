import { HeartIcon } from "@/assets/Icons";

const MenuCardLike = () => {
    return (
        <div className="text-[#adadad] text-xs flex items-center gap-2">
            <HeartIcon className="stroke-[#adadad]" />
            {/* <span>افزودن به علاقمندی ها</span> */}
        </div>
    );
}

export default MenuCardLike;