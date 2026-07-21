const FeatureItem = ({ icon, title }) => {
    return (
        <div className="flex flex-col items-center gap-3.5 lg:border-l border-l-border last:border-l-0">
            {icon}
            <p className="text-center md:text-super-base text-muted-fg">{title}</p>
        </div>
    );
}

export default FeatureItem;