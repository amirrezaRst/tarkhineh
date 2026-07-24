"use client";

import { courierImg, initials, courierState, STATE_META } from "./courierUtils";

// Courier photo wrapped in a status-coloured ring. Falls back to an initials
// tile on a brand gradient when there's no uploaded image.
const CourierAvatar = ({ courier, size = 52, radius = 15, ring = true }) => {
    const url = courierImg(courier.image);
    const state = courierState(courier);
    const ringCls = ring ? STATE_META[state].ring : "bg-transparent";

    return (
        <div className={`p-[2.5px] rounded-[18px] shrink-0 ${ringCls}`}>
            {url ? (
                <img
                    src={url}
                    alt={courier.fullName || "پیک"}
                    width={size}
                    height={size}
                    style={{ width: size, height: size, borderRadius: radius }}
                    className="object-cover block border-2 border-surface"
                />
            ) : (
                <div
                    style={{ width: size, height: size, borderRadius: radius, fontSize: size * 0.36 }}
                    className="grid place-items-center font-extrabold text-white border-2 border-surface bg-gradient-to-tl from-feature-from to-feature-mid"
                >
                    {initials(courier.fullName, courier.phoneNumber)}
                </div>
            )}
        </div>
    );
};

export default CourierAvatar;
