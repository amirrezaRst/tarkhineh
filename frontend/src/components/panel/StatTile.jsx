const StatTile = ({ label, value, icon: Icon, accent = "primary" }) => {
    const accentClasses = {
        primary: "bg-primary-subtle text-primary",
        warning: "bg-warning-subtle text-warning-fg",
        info: "bg-info-subtle text-info",
    };

    return (
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
                <p className="text-muted-fg text-super-sm mb-1.5">{label}</p>
                <p className="text-foreground text-1.5xl font-bold">{value}</p>
            </div>
            {Icon && (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            )}
        </div>
    );
};

export default StatTile;
