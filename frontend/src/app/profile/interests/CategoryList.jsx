import { CheckmarkIcon, ChevronIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const Item = ({ label, selected, path }) => {
    return (
        <PreserveQueryLink
            href={``}
            query={{ category: path }}
            className={`${selected ? "bg-primary-subtle" : "bg-surface-sunken"} flex items-center flex-none gap-1.5 py-0.5 md:px-4 px-2.5 md:leading-7 leading-6 text-foreground md:text-super-sm text-sm cursor-pointer rounded-full`}
        >
            <span>{label}</span>
            {selected ? <CheckmarkIcon className="fill-primary" /> : <ChevronIcon className="fill-muted-fg rotate-90" />}
        </PreserveQueryLink>
    )
};

const list = [
    { label: "همه", category: "all" },
    { label: "غذای اصلی", category: "main" },
    { label: "پیش غذا", category: "side" },
    { label: "دسر", category: "dessert" },
    { label: "نوشیدنی", category: "drink" },
]

const CategoryList = ({ category: selectedCategory }) => {
    return (
        <div className="flex items-center xl:flex-nowrap flex-wrap gap-2.5 overflow-hidden">

            {list.map(({ label, category }, index) =>
                <Item key={index} label={label} selected={selectedCategory == category} path={category} />
            )}

        </div>
    );
}

export default CategoryList;