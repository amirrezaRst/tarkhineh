const FeatureItem = ({ text, index }) => {
    return (
        <div className="flex items-center gap-2.5 text-muted-fg">
            <input
                type="checkbox"
                name=""
                id={`item-${index}`}
                className="appearance-none ring-1 ring-primary checked:bg-primary/85 rounded-sm p-1.5"
            />
            <label htmlFor={`item-${index}`}>
                {text}
            </label>
        </div>
    );
}

export default FeatureItem;