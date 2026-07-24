// Unified summary bar: one panel split into cells by hairline dividers, the
// first cell carrying a brand accent. A calmer, more deliberate alternative to a
// row of separate tinted tiles — used for pure-count summaries (e.g. the menu).
const MetricBar = ({ items = [] }) => (
    <div className="flex flex-col sm:flex-row bg-surface border border-border rounded-2xl overflow-hidden">
        {items.map((it, i) => (
            <div
                key={i}
                className={`flex-1 px-5 py-4 relative ${i > 0 ? "border-t sm:border-t-0 sm:border-r border-border" : ""}`}
            >
                {i === 0 && <span className="absolute right-0 top-4 bottom-4 w-[3px] rounded-full bg-primary" />}
                <div className="text-2xl font-extrabold tabular-nums leading-none">{it.value}</div>
                <div className="text-super-xs text-muted-fg mt-2">{it.label}</div>
            </div>
        ))}
    </div>
);

export default MetricBar;
