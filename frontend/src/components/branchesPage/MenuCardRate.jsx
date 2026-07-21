import PersianNumber from "@/utils/ConvertToPersianNumber";
import { OutlineStarIcon, Star1PerIcon, Star2PerIcon, Star3PerIcon, Star4PerIcon, Star5PerIcon, StarIcon } from "@/assets/Icons";


const getStarIcon = (rate) => {
    if (rate > 0 && rate <= 1) return <Star1PerIcon className="w-[22px] h-[22px]" />;
    if (rate > 1 && rate <= 2) return <Star1PerIcon className="w-[22px] h-[22px]" />;
    if (rate > 2 && rate <= 3) return <Star2PerIcon className="w-[22px] h-[22px]" />;
    if (rate > 3 && rate <= 4) return <Star3PerIcon className="w-[22px] h-[22px]" />;
    if (rate > 4 && rate < 5) return <Star4PerIcon className="w-[22px] h-[22px]" />;
    if (rate == 5) return <Star5PerIcon className="w-[22px] h-[22px]" />
    return <OutlineStarIcon className="w-[22px] h-[22px]" />;
};

const MenuCardRate = ({ reviews }) => {
    const rate = reviews?.averageRating;

    return (
        <div className="font-medium text-super-base flex items-center gap-0.5">
            {getStarIcon(rate)}

            <p>{PersianNumber(rate || 0)}
                <span className="text-subtle-fg font-light text-xs mr-0.5">
                    ({PersianNumber(reviews?.total)} امتیاز)
                </span>
            </p>
        </div>
    );
}

export default MenuCardRate;