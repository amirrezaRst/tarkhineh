import { toast } from 'react-toastify';
import { create } from 'zustand';
import { api } from '@/utils/apiClient';

const useUserStore = create(
    (set) => ({
        user: null,
        cart: null,
        loading: false,
        error: null,
        fetchUser: async () => {
            set({ loading: true, error: null });
            try {
                const { user } = await api.get('/user/userData');
                set({ user, loading: false });
            } catch (err) {
                // 401/404 just means "not logged in" - not an error worth surfacing
                if (err.status !== 401 && err.status !== 404) {
                    toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
                }
                set({ user: null, error: err.status ? null : err.message, loading: false });
            }
        },
        fetchCart: async () => {
            set({ loading: true, error: null });
            try {
                const { cart } = await api.get('/cart/');
                set({ cart: cart?.items || [], loading: false, error: null });
            } catch (err) {
                if (err.status !== 401 && err.status !== 404) {
                    toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
                }
                set({ cart: [], error: err.status ? null : err.message, loading: false });
            }
        },
        clearUser: () => set({ user: null }),
        clearCart: () => set({ cart: [] }),
        setUser: newUser => set({ user: newUser }),
        setCart: newCart => set({ cart: newCart })
    }
    ));

export default useUserStore;
