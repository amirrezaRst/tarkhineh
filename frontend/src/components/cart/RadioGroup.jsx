import { TruckIcon } from "@/assets/Icons";

const RadioGroup = ({ title, name, options, selectedValue, onChange, headerIcon: HeaderIcon }) => (
    <div
        className="md:grid grid-cols-3 flex flex-col gap-5 border border-[#CBCBCB] rounded-lg xl:px-9 px-4 xl:py-10 md:py-8 py-6"
    >
        <div className="flex items-center gap-1.5 md:border-b-0 border-b border-[#CBCBCB] md:pb-0 pb-4 md:mb-0 mb-1">
            {HeaderIcon ? <HeaderIcon className="md:w-7 md:h-7" /> : <TruckIcon className="md:w-7 md:h-7" />}
            <p className="text-[#353535] xl:text-lg md:text-base text-super-sm">{title}</p>
        </div>

        <div className="col-span-2 grid grid-cols-2 md:gap-4 gap-2 md:px-0 px-3">
            {options.map(({ id, value, label, description, icon: Icon }) => (
                <div key={id} className="flex items-center md:gap-2 gap-1">
                    <input
                        type="radio"
                        name={name}
                        id={id}
                        checked={selectedValue === value}
                        onChange={() => onChange(value)}
                    />
                    <label className="flex flex-col gap-1 text-[#717171] cursor-pointer" htmlFor={id}>
                        <p className="xl:text-super-base md:text-base text-sm">{label}</p>
                        <p className="md:block hidden xl:text-sm text-super-xs">{description}</p>
                    </label>
                    <Icon className="fill-[#717171] scale-x-[-1] md:w-7 md:h-7 w-5 h-5" />
                </div>
            ))}
        </div>
    </div>
);

export default RadioGroup;