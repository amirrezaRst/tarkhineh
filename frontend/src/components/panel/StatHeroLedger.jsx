import PersianNumber from "@/utils/ConvertToPersianNumber";
import AreaChart from "@/components/panel/charts/AreaChart";

// Editorial summary composition: one emphasised "hero" metric (with an embedded
// area chart) beside a "ledger" of secondary metrics split by hairlines — the
// deliberate replacement for a row of identical tinted tiles.
const Trend = ({ value, light = false }) => {
    if (value === null || value === undefined) return null;
    const up = value >= 0;
    const cls = light
        ? "bg-white/15 text-white"
        : up ? "text-success bg-success/10" : "text-destructive bg-destructive/10";
    return (
        <span className={`inline-flex items-center gap-1 text-super-xs font-extrabold px-2 py-0.5 rounded-full ${cls}`}>
            {up ? "▲" : "▼"} {PersianNumber(Math.abs(value))}٪
        </span>
    );
};

const StatHeroLedger = ({ hero, rows = [] }) => (
    <div className="grid lg:grid-cols-[1.55fr_1fr] gap-4">
        {/* hero */}
        <div className="relative overflow-hidden rounded-[22px] p-6 text-white flex flex-col bg-gradient-to-tl from-feature-from via-feature-mid to-feature-to shadow-soft-lg">
            <div className="absolute -top-14 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            {hero.watermark && (
                <span className="absolute top-1 left-5 text-[120px] leading-none font-extrabold text-white/5 pointer-events-none select-none tabular-nums">{hero.watermark}</span>
            )}
            <div className="relative">
                <p className="text-[10.5px] font-extrabold tracking-[0.14em] text-white/70 uppercase">{hero.label}</p>
                <p className="text-4.5xl font-extrabold tabular-nums leading-tight mt-1.5">
                    {hero.value}
                    {hero.unit && <span className="text-base font-medium text-white/75 mr-2">{hero.unit}</span>}
                </p>
                <div className="flex items-center gap-2.5 mt-2">
                    <Trend value={hero.trend} light />
                    {hero.caption && <span className="text-white/60 text-super-xs">{hero.caption}</span>}
                </div>
            </div>
            <div className="relative mt-auto -mx-6 -mb-6 pt-4">
                {hero.series?.length > 0 && <AreaChart data={hero.series} variant="dark" stretch height={72} />}
            </div>
        </div>

        {/* ledger */}
        <div className="rounded-[22px] bg-surface border border-border px-5 flex flex-col">
            {rows.map((r, i) => (
                <div key={i} className={`flex items-center justify-between gap-3 py-4 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>
                    <div>
                        <div className="text-super-sm font-bold">{r.label}</div>
                        {r.caption && <div className="text-super-xs text-subtle-fg mt-0.5">{r.caption}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                        <Trend value={r.trend} />
                        <span className="text-2xl font-extrabold tabular-nums leading-none">{r.value}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default StatHeroLedger;
