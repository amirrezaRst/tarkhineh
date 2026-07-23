import PersianNumber from "@/utils/ConvertToPersianNumber";

// Compact summary tile used across the menu / couriers / reports pages. Tone
// tints the surface with a semantic subtle colour; `plain` is a neutral card.
// An optional trend pill (real % vs previous period) sits beside the value.
const toneClasses = {
    green: "bg-primary-subtle border-primary/15",
    amber: "bg-warning-subtle border-warning/20",
    blue: "bg-info-subtle border-info/20",
    plain: "bg-surface border-border",
};

const Trend = ({ value }) => {
    if (value === null || value === undefined) return null;
    const up = value >= 0;
    return (
        <span className={`inline-flex items-center gap-1 text-super-xs font-extrabold px-2 py-0.5 rounded-full ${up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
            {up ? "▲" : "▼"} {PersianNumber(Math.abs(value))}٪
        </span>
    );
};

const MiniStat = ({ value, label, tone = "plain", trend }) => (
    <div className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.plain}`}>
        <div className="flex items-start justify-between gap-2">
            <div className="text-2xl font-extrabold leading-none tabular-nums">{value}</div>
            {trend !== undefined && <Trend value={trend} />}
        </div>
        <div className="text-super-xs text-muted-fg mt-2">{label}</div>
    </div>
);

export default MiniStat;
