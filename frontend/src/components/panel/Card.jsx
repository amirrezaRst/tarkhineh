// Soft-UI surface primitive for the panel. Depth comes from a layered soft
// shadow (see tailwind shadow-soft), not a 1px border — that's the core of the
// panel's distinctive look. `interactive` adds a hover-lift for clickable cards.
const Card = ({ children, className = "", interactive = false, as: Tag = "div", ...props }) => {
    return (
        <Tag
            className={`bg-surface rounded-2xl shadow-soft ${interactive ? "transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-0.5" : ""} ${className}`}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default Card;
