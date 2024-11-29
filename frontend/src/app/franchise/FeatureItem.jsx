const FeatureItem = ({ text, index }) => {
    return (
        <div className="flex items-center gap-2.5 text-[#717171]">
            <input
                type="checkbox"
                name=""
                id={`item-${index}`}
                className="appearance-none ring-1 ring-[#417F56] checked:bg-[#417F56]/85 rounded-sm p-1.5"
            />
            <label htmlFor={`item-${index}`}>
                {text}
            </label>
        </div>
    );
}

export default FeatureItem;