// A per-transaction callback page — has no standalone content and nothing
// here is meaningful to anyone but the user who just paid.
export const metadata = {
    title: "وضعیت پرداخت",
    robots: { index: false, follow: false },
};

export default function PaymentStatusLayout({ children }) {
    return children;
}
