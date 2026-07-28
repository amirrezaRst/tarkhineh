import { ClockIcon, LocationIcon, PhoneIcon } from "@/assets/Icons";

// Branch identity: the branch's own photo, its live open/closed state, and the
// three facts a visitor actually came for (address / phone / hours) lifted into
// a raised bar straddling the hero's bottom edge.
//
// Everything sitting on the photo uses solid/white-based colours rather than
// the *-subtle tokens: those flip to dark greys under `.dark`, but the scrim
// over a photo stays dark in every theme.
const BranchHero = ({ info }) => {
    const mapHref = info.map || null;
    const hasPhone = info.phone && info.phone !== "—";

    return (
        <>
            <header className="relative isolate flex items-end overflow-hidden md:min-h-[440px] min-h-[340px] md:pt-16 pt-12 md:pb-32 pb-24">
                <img
                    src={info.images[0]}
                    alt={`شعبه ${info.name} ترخینه`}
                    className="absolute inset-0 -z-20 w-full h-full object-cover object-center"
                />
                {/* two scrims: a directional one so the right-hand copy always
                    clears its background, plus a bottom anchor so the facts bar
                    reads as resting on something solid */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black/90 via-black/72 to-black/45" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                <div className="container">
                    <div className="flex items-center gap-2 text-white/75 text-super-sm font-bold mb-3.5">
                        <LocationIcon className="w-4 h-4 fill-current" />
                        شعبه‌های ترخینه
                    </div>

                    <h1 className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-white xl:text-4.5xl lg:text-4xl text-3xl font-bold">
                        شعبه {info.name}
                        {info.isOpen !== null &&
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-super-sm font-bold align-middle ${info.isOpen
                                    ? "bg-primary text-primary-fg"
                                    : "bg-destructive text-destructive-fg"}`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {info.isOpen ? "هم‌اکنون باز است" : "هم‌اکنون بسته است"}
                            </span>
                        }
                    </h1>

                    <p className="text-white/80 md:text-base text-super-sm mt-2.5 max-w-xl">
                        {info.hoursLabel} — سفارش آنلاین یا حضوری.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className="relative z-[2] -mt-16 grid md:grid-cols-3 bg-surface border border-border rounded-2xl shadow-soft-lg overflow-hidden">
                    <Fact
                        icon={<LocationIcon className="w-5 h-5 fill-current" />}
                        label="آدرس"
                        value={info.address}
                        action={mapHref ? { href: mapHref, text: "مشاهده روی نقشه" } : null}
                    />
                    <Fact
                        icon={<PhoneIcon className="w-5 h-5 fill-current" />}
                        label="تماس"
                        value={<span className="tabular-nums" dir="ltr">{info.phone}</span>}
                        action={hasPhone ? { href: `tel:${info.phone}`, text: "تماس مستقیم" } : null}
                    />
                    <Fact
                        icon={<ClockIcon className="w-5 h-5 fill-current" />}
                        label="ساعات کاری"
                        value={info.hoursLabel}
                    />
                </div>
            </div>
        </>
    );
};

const Fact = ({ icon, label, value, action }) => (
    <div className="flex items-start gap-3.5 px-6 py-5 border-t border-border first:border-t-0 md:border-t-0 md:border-r md:first:border-r-0">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-subtle text-primary grid place-items-center">
            {icon}
        </div>
        <div className="min-w-0">
            <div className="text-super-xs font-bold text-subtle-fg mb-0.5">{label}</div>
            <div className="text-super-sm text-foreground leading-6">{value}</div>
            {action &&
                <a
                    href={action.href}
                    target={action.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="inline-block text-super-xs font-bold text-primary hover:text-primary-hover mt-1"
                >
                    {action.text} ←
                </a>
            }
        </div>
    </div>
);

export default BranchHero;
