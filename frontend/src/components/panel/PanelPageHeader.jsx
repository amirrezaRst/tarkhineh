// Consistent page header for every panel page: title + optional subtitle on the
// right (RTL), optional action slot on the left.
const PanelPageHeader = ({ title, subtitle, action }) => {
    return (
        <div className="flex items-start justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {subtitle && <p className="text-muted-fg text-super-sm mt-1.5">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
};

export default PanelPageHeader;
