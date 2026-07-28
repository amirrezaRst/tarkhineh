"use client";

import HeaderBanner from "@/components/HeaderBanner";
import RestaurantCard from "./RestaurantCard";
import useBranches from "@/hooks/useBranches";

const ContactUsPage = () => {
    const branches = useBranches();

    return (
        <>

            <HeaderBanner imageSrc="/images/contact-background-hero.jpg" title="با ترخینه در تماس باشید." />

            <section className="container md:py-20 py-16 space-y-9">

                {(branches || []).map((b) =>
                    <RestaurantCard key={b.id} name={b.name} address={b.address} phone={b.phone} hoursLabel={b.hoursLabel} isOpen={b.isOpen} images={b.images} path={b.id} map={b.map} />
                )}

            </section>

        </>
    );
}

export default ContactUsPage;
