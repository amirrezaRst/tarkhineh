"use client";

// Reusable vertical bar chart (CSS bars). data: [{ label, value }].
// The tallest bar is highlighted with the brand gradient; the rest are muted green.
const BarChart = ({ data = [], height = 150 }) => {
    if (!data.length) return null;
    const max = Math.max(...data.map((d) => d.value), 1);
    const peak = data.reduce((mi, d, i, arr) => (d.value > arr[mi].value ? i : mi), 0);

    return (
        <div className="flex items-end gap-2" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                        className={`w-full max-w-[30px] rounded-t-md transition-[filter] hover:brightness-105 ${i === peak
                            ? "bg-gradient-to-b from-[hsl(var(--brand-400))] to-[hsl(var(--brand-700))]"
                            : "bg-gradient-to-b from-[hsl(var(--brand-200))] to-[hsl(var(--brand-400))]"
                            }`}
                        style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 6 : 2)}%` }}
                        title={`${d.value}`}
                    />
                    <span className="text-super-xs text-subtle-fg">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

export default BarChart;
