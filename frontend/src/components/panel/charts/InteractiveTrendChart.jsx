"use client";

import { useId, useRef, useState } from "react";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";

// Interactive area/line trend. data: [{ label, value, orders }]. `metric` picks
// which field is plotted. Hovering shows a crosshair + emphasised point + a
// tooltip with the exact figure — the chart reads live from real data.
const abbrev = (n) => {
    if (n >= 1_000_000) return `${PersianNumber((n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0))}م`;
    if (n >= 1_000) return `${PersianNumber(Math.round(n / 1000))}هزار`;
    return PersianNumber(n);
};

const InteractiveTrendChart = ({ data = [], metric = "value", height = 240 }) => {
    const id = useId().replace(/:/g, "");
    const wrapRef = useRef(null);
    const [hover, setHover] = useState(null);

    if (!data.length) return <div className="h-40 grid place-items-center text-super-sm text-muted-fg">داده‌ای برای نمایش نیست.</div>;

    const W = 640, H = height, padX = 46, padTop = 24, padBottom = 34;
    const vals = data.map((d) => (metric === "orders" ? d.orders : d.value) || 0);
    const max = Math.max(...vals, 1);
    const n = data.length;
    const stepX = n > 1 ? (W - padX * 2) / (n - 1) : 0;
    const xOf = (i) => padX + i * stepX;
    const yOf = (v) => padTop + (1 - v / max) * (H - padTop - padBottom);

    const pts = vals.map((v, i) => [xOf(i), yOf(v)]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${line} L${xOf(n - 1)},${H - padBottom} L${padX},${H - padBottom} Z`;
    const grid = [0, 0.33, 0.66, 1];
    const fmt = (v) => (metric === "orders" ? `${PersianNumber(v)} سفارش` : `${FormatPrice(v)} تومان`);

    const onMove = (e) => {
        const rect = wrapRef.current.getBoundingClientRect();
        const frac = (e.clientX - rect.left) / rect.width;      // 0..1 across container
        const xInVb = frac * W;
        let i = Math.round((xInVb - padX) / (stepX || 1));
        i = Math.max(0, Math.min(n - 1, i));
        setHover(i);
    };

    return (
        <div ref={wrapRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ direction: "ltr", display: "block" }} role="img" aria-label="نمودار روند">
                <defs>
                    <linearGradient id={`tg-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
                        <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* grid + y labels */}
                {grid.map((g, i) => {
                    const y = padTop + g * (H - padTop - padBottom);
                    const v = Math.round(max * (1 - g));
                    return (
                        <g key={i}>
                            <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="hsl(var(--border))" strokeWidth="1" />
                            <text x={padX - 8} y={y + 4} textAnchor="end" fontSize="11" fill="hsl(var(--subtle-fg))" fontFamily="inherit">{abbrev(v)}</text>
                        </g>
                    );
                })}

                <path d={area} fill={`url(#tg-${id})`} />
                <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* x labels */}
                {data.map((d, i) => (
                    <text key={i} x={xOf(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="hsl(var(--subtle-fg))" fontFamily="inherit">{d.label}</text>
                ))}

                {/* base dots */}
                {pts.map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r={hover === i ? 0 : 3} fill="#fff" stroke="hsl(var(--primary))" strokeWidth="2" />
                ))}

                {/* hover crosshair + emphasised point */}
                {hover !== null && (
                    <g>
                        <line x1={pts[hover][0]} y1={padTop} x2={pts[hover][0]} y2={H - padBottom} stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                        <circle cx={pts[hover][0]} cy={pts[hover][1]} r="6" fill="hsl(var(--primary))" stroke="#fff" strokeWidth="3" />
                    </g>
                )}
            </svg>

            {hover !== null && (
                <div
                    className="absolute -translate-x-1/2 -top-1 pointer-events-none bg-foreground text-background text-super-xs font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-soft"
                    style={{ left: `${(pts[hover][0] / W) * 100}%` }}
                >
                    {data[hover].label} · {fmt(vals[hover])}
                </div>
            )}
        </div>
    );
};

export default InteractiveTrendChart;
