import FoodMenuItem from './FoodMenuItem';

const foodItems = [
  { imageSrc: '/images/food-image.png', title: 'غذای اصلی' },
  { imageSrc: '/images/appetizer-image.png', title: 'پیش غذا' },
  { imageSrc: '/images/dessert-image.png', title: 'دسر' },
  { imageSrc: '/images/drink-image.png', title: 'نوشیدنی' }
];

const FoodMenu = () => (
  <section className="lg:pt-16 pt-12 lg:pb-24 md:pb-20 pb-24 container">
    <h4 className="md:text-3xl text-2.5xl font-semibold text-center">منو رستوران</h4>
    <div className="grid md:grid-cols-4 grid-cols-2 md:gap-5 gap-x-5 gap-y-36 3xl:mt-64 2xl:mt-44 xl:mt-28 md:mt-20 mt-28">
      {foodItems.map((item, index) => (
        <FoodMenuItem key={index} imageSrc={item.imageSrc} title={item.title} />
      ))}
    </div>
  </section>
);

export default FoodMenu;
