// Private/transient — a shopping cart has no standalone value to a search
// engine and no one else's cart is ever reachable at this URL.
export const metadata = {
    title: "سبد خرید",
    robots: { index: false, follow: false },
};

export default function CartRouteLayout({ children }) {
    return children;
}
