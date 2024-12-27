// zustand için store
// auth işlemleri için kullanılan bir kütüphane

import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    login: async (UserID, Password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:5000/auth/login", { UserID, Password }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            set({ user: response.data, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ error: error, isLoading: false });
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.get("http://localhost:5000/auth/logout", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ error: error, isLoading: false });
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get("http://localhost:5000/auth/checkAuth", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (response.data){
                set({ user: response.data, isAuthenticated: true, isCheckingAuth: false });
            } else {
                set({ isCheckingAuth: false, isAuthenticated: false, user: null });
            }
        } catch (error) {
            set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        }
    }
}));