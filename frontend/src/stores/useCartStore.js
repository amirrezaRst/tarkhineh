import { toast } from "react-toastify";
import { create } from "zustand";
import { api } from "@/utils/apiClient";

const useCartStore = create((set) => ({
    cart: null,
    deliveryType: "courier",
    selectedAddress: null,
    notes: "",
    paymentMethod: "online",
    paymentGateway: "saman",
    cartBranch: null, //! Must be Change and set anytime cart is nul and after set new item
    discount: null,
    loading: false,
    error: null,

    setCart: (cart) => set({ cart }),
    setDeliveryType: (deliveryType) => set({ deliveryType }),
    setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
    setNotes: (notes) => set({ notes }),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    setPaymentGateway: (paymentGateway) => set({ paymentGateway }),
    setDiscount: (discount) => set({ discount }),
    setLoading: (loading) => set({ loading }),

    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const { cart, cartBranch } = await api.get('/cart/');
            set({ cart: cart?.items || [], cartBranch, loading: false, error: null });
        } catch (err) {
            if (err.status !== 401 && err.status !== 404) {
                toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
            }
            set({ cart: [], error: err.status ? null : err.message, loading: false });
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
