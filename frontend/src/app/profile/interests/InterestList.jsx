import { useEffect, useState } from "react";
import InterestCard from "./InterestCard";
import InterestCardSkeleton from "./InterestCardSkeleton";
import { fetchInterestItems } from "@/services/LikeService";

const InterestList = ({ userId, category }) => {
    const [items, setItems] = useState();

    useEffect(() => {
        if (userId) fetchInterestItems(userId, category, setItems);
    }, [userId, category])

    return (
        <section className="md:my-10 mt-14 mb-6">

            {items == undefined ? (
                <div
                    className="grid xl:grid-cols-3 md:grid-cols-2 lg:gap-6 gap-5"
                >
                    {
                        [...Array(3)].map((_, index) =>
                            <InterestCardSkeleton key={index} />)
                    }
                </div>
            )
                : items?.length === 0 ?
                    (
                        <div className="relative w-full min-h-96 h-full overflow-hidden flex flex-col items-center justify-center">


                            <img src="/images/spider-background.png" alt="" className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] opacity-35" />

                            <div className="flex flex-col items-center gap-7 z-10">
                                <p className="text-1.5xl text-[#757575]">
                                    هنوز هیچ آیتمی به لیست علاقه مندی های شما اضافه نشده!
                                </p>
                            </div>

                        </div>
                    ) :
                    (
                        <div
                            className="grid xl:grid-cols-3 md:grid-cols-2 lg:gap-6 gap-5"
                        >
                            {items.map(({ discount, menuItem, reviews }, index) => (
                                <InterestCard
                                    key={index}
                                    id={menuItem._id}
                                    name={menuItem.name}
                                    images={menuItem.images}
                                    price={menuItem.price}
                                    discount={discount}
                                    reviews={reviews}
                                />
                            ))}
                        </div>
                    )
            }

        </section>
    );
}

export default InterestList;