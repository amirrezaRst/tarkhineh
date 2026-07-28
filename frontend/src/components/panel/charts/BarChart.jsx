"use client";

import { useState } from "react";
import PersianNumber from "@/utils/ConvertToPersianNumber";

// Reusable vertical bar chart (CSS bars). data: [{ label, value }].
// The tallest bar is highlighted with the brand gradient; the rest are muted green.
// Hovering a bar shows a small elevated tooltip card (label + formatted value)
// instead of a plain browser title. `formatValue` lets callers render money
// ("۴۲۰,۰۰۰ تومان"), counts ("۱۲ سفارش"), etc. — defaults to plain Persian digits.
const BarChart = ({ data = [], height = 150, formatValue }) => {
    const [hover, setHover] = useState(null);
    if (!data.length) return null;
    const max = Math.max(...data.map((d) => d.value), 1);
    const peak = data.reduce((mi, d, i, arr) => (d.value > arr[mi].value ? i : mi), 0);
    const fmt = formatValue || ((v) => PersianNumber(v));

    return (
        <div className="flex items-end gap-2" style={{ height }}>
            {data.map((d, i) => (
                <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                >
                    <div
                        className="relative w-full max-w-[30px] flex justify-center"
                        style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 6 : 2)}%` }}
                    >
                        {hover === i && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none flex flex-col items-center stagger-in">
                                <div className="bg-surface border border-border rounded-xl shadow-soft-lg px-3 py-2 whitespace-nowrap text-center">
                                    <div className="text-super-xs text-muted-fg font-semibold">{d.label}</div>
                                    <div className="text-super-sm font-extrabold tabular-nums text-foreground mt-0.5">{fmt(d.value)}</div>
                                </div>
                                <div className="w-2 h-2 bg-surface border-b border-r border-border rotate-45 -mt-1" />
                            </div>
                        )}
                        <div
                            className={`w-full h-full rounded-t-md transition-[filter] ${hover === i ? "brightness-110" : "hover:brightness-105"} ${i === peak
                                ? "bg-gradient-to-b from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]"
                                : "bg-gradient-to-b from-[hsl(var(--brand-200))] to-[hsl(var(--brand-400))]"
                                }`}
                        />
                    </div>
                    <span className="text-super-xs text-subtle-fg">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

export default BarChart;
