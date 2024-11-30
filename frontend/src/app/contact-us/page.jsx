import HeaderBanner from "@/components/HeaderBanner";
import RestaurantCard from "./RestaurantCard";

const restaurants = [
    {
        branch: "تهرانپارس",
        address: "تهران پارس، فلکه سوم، پاساژ سیوان",
        phone: "۰۲۱-۵۴۸۹۱۲۵۰-۵۱",
        image: "/images/restaurant-image-1.jpg"
    },
    {
        branch: "چالوس",
        address: "چالوس، خیابان ۱۷ شهریور، بعد کوچه کوروش، جنب داروخانه دکتر میلانی",
        phone: "۰۲۱-۵۴۸۹۱۲۵۲-۵۳",
        image: "/images/restaurant-image-2.jpg"
    },
    {
        branch: "اقدسیه",
        address: "خیابان اقدسیه ، نرسیده به میدان خیام، پلاک ۸",
        phone: "۰۲۱-۵۴۸۹۱۲۵۴-۵۵",
        image: "/images/restaurant-image-3.jpg"
    },
    {
        branch: "ونک",
        address: "میدان ونک، خیابان فردوسی، نبش کوچه نیلوفر، پلاک ۲۶",
        phone: "۰۲۱-۵۴۸۹۱۲۵۶-۵۷",
        image: "/images/restaurant-image-4.jpg"
    }
]

const ContactUsPage = () => {
    return (
        <>

            <HeaderBanner imageSrc="/images/contact-background-hero.jpg" title="با ترخینه در تماس باشید." />

            <section className="container md:py-20 py-16 space-y-9">

                {restaurants.map(({ branch, address, phone, image }, index) =>
                    <RestaurantCard key={index} branch={branch} address={address} phone={phone} image={image} />
                )}

            </section>

        </>
    );
}

export default ContactUsPage;