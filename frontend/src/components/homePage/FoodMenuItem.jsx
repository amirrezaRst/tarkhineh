import PreserveQueryLink from "@/hooks/PreserveQueryLink";
import Image from "next/image";

const FoodMenuItem = ({ imageSrc, title, category }) => (
  <PreserveQueryLink href="/menus" query={{ category }}>
    <div className="relative w-full xl:h-[170px] lg:h-[140px] h-[110px] bg-primary rounded-lg">
      <Image
        src={imageSrc}
        alt={title}
        className="absolute bottom-[30px] right-[50%] translate-x-[50%] w-[85%]"
        width={512}
        height={512}
      />
      <div className="absolute lg:bottom-[-25px] -bottom-5 right-[50%] translate-x-[50%] w-[65%] lg:h-[50px] h-10 bg-background flex items-center justify-center rounded-md shadow-lg">
        <p className="lg:text-lg text-super-sm text-foreground font-medium">{title}</p>
      </div>
    </div>
  </PreserveQueryLink>
);

export default FoodMenuItem;
