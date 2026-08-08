import FoodMenuItem from './FoodMenuItem';

const foodItems = [
  { imageSrc: '/images/food-image.png', title: 'غذای اصلی', category: "main" },
  { imageSrc: '/images/appetizer-image.png', title: 'پیش غذا', category: "side" },
  { imageSrc: '/images/dessert-image.png', title: 'دسر', category: "dessert" },
  { imageSrc: '/images/drink-image.png', title: 'نوشیدنی', category: "drink" }
];

const FoodMenu = () => (
  <section className="lg:pt-16 pt-12 lg:pb-24 md:pb-20 pb-24 container">
    <h4 className="md:text-3xl text-2.5xl font-semibold text-center">منو رستوران</h4>
    <div className="grid md:grid-cols-4 grid-cols-2 md:gap-5 gap-x-5 gap-y-36 3xl:mt-64 2xl:mt-44 xl:mt-28 md:mt-20 mt-28">
      {/* All four are above the fold on first load (no scroll needed on any
          breakpoint) — one of them is consistently flagged as the LCP element
          in PageSpeed audits, and Next.js lazy-loads <Image> by default, so
          all four get `priority` to make sure whichever one it picks isn't
          held back by lazy-loading. */}
      {foodItems.map((item, index) => (
        <FoodMenuItem key={index} {...item} priority />
      ))}
    </div>
  </section>
);

export default FoodMenu;
