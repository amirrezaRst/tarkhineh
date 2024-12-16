import { OutlineStarIcon, Star2PerIcon, Star5PerIcon } from "@/assets/Icons";

const StarRating = ({ rate }) => {
    const filledStars = Array(Math.floor(rate)).fill('filled');
    const halfStar = rate % 1 !== 0 ? ['half'] : [];
    const emptyStars = Array(5 - Math.floor(rate) - halfStar.length).fill('empty');

    const safeRating = rate == null || isNaN(rate) ? 0 : parseFloat(rate);
    return (
        <div className="flex flex-row-reverse items-center 3xl:gap-1 gap-0.5">
            {filledStars.map((_, index) => (
                <Star5PerIcon key={index}
                    className={`w-6 h-6 3xl:w-5 3xl:h-5 text-c-red-45`}
                />
            ))}
            {halfStar.map((_, index) => (
                <Star2PerIcon key={index}
                    className={`w-6 h-6 3xl:w-5 3xl:h-5 text-c-red-45`}
                />
            ))}
            {emptyStars.map((_, index) => (
                <OutlineStarIcon key={index}
                    className={`w-6 h-6 3xl:w-5 3xl:h-5 fill-c-grey-60`}
                />
            ))}
            {/* {formattedRating} */}
        </div>
    );
}

export default StarRating;