"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronIcon } from "@/assets/Icons";
import { api } from "@/utils/apiClient";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
const AUTOPLAY_MS = 6000;

const SlideButton = ({ text, link }) => {
    if (!text || !link) return null;
    if (/^https?:\/\//.test(link)) {
        return (
            <a href={link} target="_blank" rel="noreferrer">
                <button className="bg-primary rounded-lg py-2 px-8 text-white lg:text-base text-super-sm hover:bg-primary-hover transition-colors">
                    {text}
                </button>
            </a>
        );
    }
    return (
        <PreserveQueryLink href={link}>
            <button className="bg-primary rounded-lg py-2 px-8 text-white lg:text-base text-super-sm hover:bg-primary-hover transition-colors">
                {text}
            </button>
        </PreserveQueryLink>
    );
};

const Slider = () => {
    const pathname = usePathname();
    const [slides, setSlides] = useState(null);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const show = pathname === "/" || pathname === "/menus" || pathname === "/branches";

    useEffect(() => {
        if (!show) return;
        const controller = new AbortController();
        api.get("/slide", { signal: controller.signal })
            .then((res) => setSlides(res.slides || []))
            .catch((err) => { if (err.name !== "AbortError") setSlides([]); });
        return () => controller.abort();
    }, [show]);

    useEffect(() => {
        if (!slides || slides.length < 2 || paused) return;
        const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
        return () => clearInterval(t);
    }, [slides, paused]);

    useEffect(() => { setIndex(0); }, [slides?.length]);

    if (!show || !slides || slides.length === 0) return null;

    const go = (i) => setIndex((i + slides.length) % slides.length);

    return (
        <section
            className="relative w-full md:h-[400px] h-[350px] overflow-hidden bg-neutral-800"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {slides.map((s, i) => (
                <div
                    key={s._id}
                    aria-hidden={i !== index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === index ? "opacity-100 z-[1]" : "opacity-0 pointer-events-none"}`}
                >
                    <div
                        key={`${s._id}-${i === index}`}
                        className="hero-slide-bg absolute inset-0 bg-center bg-cover"
                        style={{ backgroundImage: `url(${IMAGE_URL}/slides/${s.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />

                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
                        {s.title &&
                            <h1 className="text-white xl:text-4.5xl lg:text-4xl text-3xl md:leading-normal leading-[45px] font-bold max-w-3xl">
                                {s.title}
                            </h1>
                        }
                        {s.subtitle &&
                            <p className="text-white/90 md:text-lg text-super-base max-w-2xl">
                                {s.subtitle}
                            </p>
                        }
                        <SlideButton text={s.buttonText} link={s.buttonLink} />
                    </div>
                </div>
            ))}

            {slides.length > 1 &&
                <>
                    <div className="absolute z-[2] inset-y-0 w-full flex items-center justify-between px-6">
                        <button onClick={() => go(index - 1)} aria-label="اسلاید قبلی" className="p-3 md:block hidden hover:opacity-70 transition-opacity">
                            <ChevronIcon className="-rotate-90 fill-white w-7 h-7" />
                        </button>
                        <button onClick={() => go(index + 1)} aria-label="اسلاید بعدی" className="p-3 md:block hidden hover:opacity-70 transition-opacity">
                            <ChevronIcon className="rotate-90 fill-white w-7 h-7" />
                        </button>
                    </div>

                    <div className="z-[2] bg-white flex items-center gap-2.5 md:py-3 py-2.5 md:px-9 px-7 rounded-t-2xl absolute bottom-0 left-1/2 -translate-x-1/2">
                        {slides.map((s, i) => (
                            <button
                                key={s._id}
                                onClick={() => go(i)}
                                aria-label={`رفتن به اسلاید ${i + 1}`}
                                className={`rounded-full transition-all ${i === index ? "md:w-3 md:h-3 w-2 h-2 bg-primary" : "md:w-2 md:h-2 w-1.5 h-1.5 bg-subtle-fg"}`}
                            />
                        ))}
                    </div>
                </>
            }
        </section>
    );
}

export default Slider;
