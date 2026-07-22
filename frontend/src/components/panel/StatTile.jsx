// A secondary stat card (the dashboard's primary metric lives in its hero band,
// not here). Icons must be monochrome from assets/Icons.jsx — the accent colour
// is applied via `fill-current` so the icon inherits the tile's accent text
// colour (CSS fill overrides the svg's fill="none" presentation attribute).
const StatTile = ({ label, value, icon: Icon, accent = "primary" }) => {
    const accentClasses = {
        primary: "bg-primary-subtle text-primary",
        warning: "bg-warning-subtle text-warning-fg",
        info: "bg-info-subtle text-info",
        courier: "bg-role-courier-subtle text-role-courier",
    };

    return (
        <div className="bg-surface rounded-2xl shadow-soft p-5 flex items-center justify-between gap-4 transition-shadow duration-200 hover:shadow-soft-lg">
            <div>
                <p className="text-muted-fg text-super-sm mb-1.5">{label}</p>
                <p className="text-foreground text-2.5xl font-bold tabular-nums leading-tight">{value}</p>
            </div>
            {Icon && (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
                    <Icon className="w-6 h-6 fill-current" />
                </div>
            )}
        </div>
    );
};

export default StatTile;
