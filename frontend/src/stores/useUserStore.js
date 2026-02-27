import { toast } from 'react-toastify';
import { create } from 'zustand';

const useUserStore = create(
    (set) => ({
        user: null,
        cart: null,
        loading: false,
        error: null,
        fetchUser: async () => {
            set({ loading: true, error: null });
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/userData`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }).then(res => res.json());
                const { status, user } = response;

                if (status === 500) toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

                document.cookie = `role=${user.role}; path=/`;

                set({ user: user, loading: false });
            } catch (error) {
                console.log(error)
                toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
                set({ error: error.message, loading: false });
            }
        },
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

                const { status, cart } = response;
                console.log(response)
                if (status === 500) toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

                // console.log(response)

                set({ cart: cart?.items || [], loading: false, error: null });
            } catch (error) {
                console.log(error)
                toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
                set({ error: error.message, loading: false });
            }
        },
        clearUser: () => set({ user: null }),
        clearCart: () => set({ cart: [] }),
        setUser: newUser => set({ user: newUser }),
        setCart: newCart => set({ cart: newCart })
    }
    ));

export default useUserStore;