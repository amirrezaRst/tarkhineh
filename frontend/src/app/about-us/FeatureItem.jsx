const FeatureItem = ({ icon, title }) => {
    return (
        <div className="flex flex-col items-center gap-3.5 lg:border-l border-l-[#CBCBCB] last:border-l-0">
            {icon}
            <p className="text-center md:text-super-base text-[#717171]">{title}</p>
        </div>
    );
}

export default FeatureItem;