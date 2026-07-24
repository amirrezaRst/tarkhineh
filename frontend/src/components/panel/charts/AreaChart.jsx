"use client";

import { useId } from "react";

// Reusable area+line chart (hand-drawn SVG, no chart lib). Baseline at 0.
// data: [{ value }]  (extra keys ignored).
// - stretch=true  → fills width via preserveAspectRatio="none"; line+area only
//   (dots would distort into ovals when stretched), ideal for a wide sparkline.
// - stretch=false → uniform scaling; crisp circular dots + emphasized endpoint.
// variant "dark" is tuned for the dark-green feature card; "light" for white cards.
const AreaChart = ({ data = [], variant = "light", stretch = false, height = 72, className = "" }) => {
    const id = useId().replace(/:/g, "");
    if (!data.length) return null;

    const W = 300;
    const H = height;
    const padY = 8;
    const max = Math.max(...data.map((d) => d.value), 1);
    const n = data.length;
    const stepX = n > 1 ? W / (n - 1) : W;
    const yOf = (v) => H - padY - (v / max) * (H - padY * 2);
    const pts = data.map((d, i) => [n > 1 ? i * stepX : W / 2, yOf(d.value)]);

    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${line} L${W},${H} L0,${H} Z`;
    const last = pts[pts.length - 1];

    const isDark = variant === "dark";
    const stroke = isDark ? "#A6ECBE" : "hsl(var(--primary))";
    const fillColor = isDark ? "#8FE3AC" : "hsl(var(--primary))";
    const dotFill = isDark ? "#153525" : "#fff";
    const endRing = isDark ? "#153525" : "#fff";

    const svgProps = stretch
        ? { preserveAspectRatio: "none", width: "100%", height: H }
        : { width: "100%", height: "auto" };

    return (
        <svg viewBox={`0 0 ${W} ${H}`} {...svgProps} className={className} style={{ direction: "ltr", display: "block" }} role="img" aria-label="نمودار روند">
            <defs>
                <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={fillColor} stopOpacity={isDark ? 0.35 : 0.26} />
                    <stop offset="1" stopColor={fillColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#area-${id})`} />
            <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {!stretch && (
                <>
                    {pts.slice(0, -1).map((p, i) => (
                        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={dotFill} stroke={stroke} strokeWidth="2" />
                    ))}
                    <circle cx={last[0]} cy={last[1]} r="5" fill={stroke} stroke={endRing} strokeWidth="2.5" />
                </>
            )}
        </svg>
    );
};

export default AreaChart;
