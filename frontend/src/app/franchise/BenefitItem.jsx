const BenefitItem = ({ text }) => {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-4.5 h-4.5 rounded-md rotate-45 border-2 border-primary" />
            <p className="md:text-[19px] text-super-sm leading-7 text-foreground">
                {text}
            </p>
        </div>
    );
}

export default BenefitItem;