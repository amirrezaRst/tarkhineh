import { toast } from "react-toastify";
import { create } from "zustand";

const useCartStore = create((set) => ({
    cart: null,
    deliveryType: "courier",
    selectedAddress: null,
    notes: "",
    paymentMethod: "online",
    paymentGateway: "saman",
    cartBranch: null, //! Must be Change and set anytime cart is nul and after set new item
    loading: false,
    error: null,

    setCart: (cart) => set({ cart }),
    setDeliveryType: (deliveryType) => set({ deliveryType }),
    setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
    setNotes: (notes) => set({ notes }),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    setPaymentGateway: (paymentGateway) => set({ paymentGateway }),

    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }).then(res => res.json());

            const { status, cart, cartBranch } = response;
            console.log("fetchCart response: ", response)
            if (status === 500) toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

            set({ cart: cart?.items || [], cartBranch, loading: false, error: null });
        } catch (error) {
            toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
            set({ error: error.message, loading: false });
        }
    },

    clearCart: () => set({ cart: [] }),
    resetStates: () => set({
        deliveryType: "courier",
        selectedAddress: null,
        notes: "",
        paymentMethod: "online",
        paymentGateway: "saman",
    }),
}));
export default useCartStore;
