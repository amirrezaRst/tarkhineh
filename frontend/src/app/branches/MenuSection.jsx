import MenuCard from "@/components/branchesPage/MenuCard";

const MenuSection = ({ title, items, bgColor = 'white' }) => {
    return (
        <section className={`md:py-[4.5rem] py-10 ${bgColor === 'green' ? 'bg-[#417F56]' : ''}`}>
            <div className="container">
                <h2 className={`md:text-2.5xl text-2xl ${bgColor === 'green' ? 'text-white' : 'text-[#353535]'} font-semibold`}>
                    {title}
                </h2>
                <div className="flex flex-nowrap gap-7 overflow-x-auto md:mt-11 mt-7 pb-1.5">
                    {items.map((item, index) => (
                        <MenuCard key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MenuSection;