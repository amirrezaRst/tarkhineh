const ConsultationSection = () => {
    return (
        <section className="container md:py-20 py-16 xl:border-b-2 border-border/30">

            <h2 className="xl:text-2.5xl md:text-2xl text-1.5xl text-foreground text-center md:font-semibold font-bold md:mb-12 mb-9">
                دریافت مشاوره
            </h2>

            {/*//! Consultation Form */}
            <form action="">

                <div className="grid lg:grid-cols-3 md:grid-cols-2 md:gap-6 gap-4">

                    <input
                        type="text"
                        className="py-2.5 px-4 border border-border md:text-base text-super-sm rounded-md text-muted-fg placeholder:text-muted-fg"
                        placeholder="نام و نام خانوادگی"
                    />
                    <input
                        type="text"
                        className="py-2.5 px-4 border border-border md:text-base text-super-sm rounded-md text-muted-fg placeholder:text-muted-fg"
                        placeholder="شماره تماس"
                    />
                    <input
                        type="text"
                        className="py-2.5 px-4 border border-border md:text-base text-super-sm rounded-md text-muted-fg placeholder:text-muted-fg lg:col-span-1 md:col-span-2"
                        placeholder="ایمیل"
                    />

                </div>

                <button className="bg-primary text-white text-super-sm block mx-auto rounded-md py-3 px-6 mt-7">
                    درخواست مشاوره
                </button>

            </form>

        </section>
    );
}

export default ConsultationSection;