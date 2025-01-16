import { create } from 'zustand';

const useUserStore = create(
    (set) => ({
        user: null,
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
                });
                const data = await response.json();
                set({ user: data.user, loading: false });
            } catch (error) {
                console.log(error)
                set({ error: error.message, loading: false });
            }
        },
        clearUser: () => set({ user: null }),
        setUser: newUser => set({ user: newUser })
    }
    ));

export default useUserStore;