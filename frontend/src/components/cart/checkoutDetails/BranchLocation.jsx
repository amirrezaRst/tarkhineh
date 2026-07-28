"use client";

import { LocationIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";
import useBranch from "@/hooks/useBranch";

const BranchLocation = () => {
    const { deliveryType, cartBranch } = useCartStore();
    const { branch } = useBranch(cartBranch);

    if (deliveryType == "person" && branch) return (
        <div className="flex gap-6 border border-border rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-4">
            <div>
                <div className="flex items-center gap-1">
                    <LocationIcon className="fill-foreground w-7 h-7" />
                    <p className="md:text-lg text-super-base text-foreground">آدرس شعبه {branch.name}</p>
                </div>

                <div className="space-y-3 text-super-sm text-muted-fg mt-8">
                    <p>{branch?.address}</p>
                    <p>شماره تماس: <span dir="ltr">{branch?.phone}</span></p>
                    <p>ساعت کاری: {branch?.hoursLabel}</p>
                </div>

                {branch?.map &&
                    <a href={branch.map} target="_blank" rel="noreferrer">
                        <button className="border border-muted-fg rounded text-muted-fg py-2 px-6 mt-6">
                            مشاهده در نقشه
                        </button>
                    </a>
                }
            </div>

            {branch?.largeMap &&
                <iframe
                    src={branch.largeMap}
                    className="flex-1 h-64 border border-border rounded"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            }
        </div>
    );
};

export default BranchLocation;
