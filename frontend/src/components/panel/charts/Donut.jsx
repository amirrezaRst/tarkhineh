"use client";

// Reusable donut. segments: [{ label, value, color }] where color is any CSS
// color string (e.g. "hsl(var(--status-delivered))"). Zero-value segments are
// dropped. Uses pathLength=100 arcs so percentages map directly to dash lengths.
const Donut = ({ segments = [], centerValue, centerLabel, size = 150, thickness = 20, gap = 1 }) => {
    const visible = segments.filter((s) => s.value > 0);
    const total = visible.reduce((sum, s) => sum + s.value, 0) || 1;
    const c = size / 2;
    const r = (size - thickness) / 2;

    let cumulative = 0;
    const arcs = visible.map((s, i) => {
        const pct = (s.value / total) * 100;
        const rotation = -90 + cumulative * 3.6;
        cumulative += pct;
        return (
            <circle
                key={i}
                cx={c}
                cy={c}
                r={r}
                pathLength="100"
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${Math.max(pct - gap, 0.5)} 100`}
                transform={`rotate(${rotation} ${c} ${c})`}
            />
        );
    });

    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={c} cy={c} r={r} fill="none" stroke="hsl(var(--surface-sunken))" strokeWidth={thickness} />
                {arcs}
            </svg>
            {(centerValue !== undefined || centerLabel) && (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
                    <div>
                        {centerValue !== undefined && <div className="text-2xl font-bold leading-none tabular-nums text-foreground">{centerValue}</div>}
                        {centerLabel && <div className="text-super-xs text-muted-fg mt-1">{centerLabel}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donut;
