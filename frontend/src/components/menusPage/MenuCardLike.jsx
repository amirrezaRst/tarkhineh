import { HeartIcon } from "@/assets/Icons";

const MenuCardLike = ({ handler }) => {
    return (
        <button
            className="hover:scale-110 duration-200"
            onClick={handler}
        >
            <HeartIcon className="stroke-[#717171] md:w-6 md:h-6 w-5 h-5" />
        </button>
    );
}

export default MenuCardLike;