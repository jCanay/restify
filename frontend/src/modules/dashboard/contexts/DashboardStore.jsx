import { atom } from "nanostores";

export const dashboardStore = atom({ data: {}, loading: false, error: "" });

export const addDashboard = (data) => {
    let current = dashboardStore.get();
    dashboardStore.set({ ...current, data: data });
};

export const setLoading = (loading) => {
    let current = dashboardStore.get();
    dashboardStore.set({ ...current, loading: loading });
};

export const setError = (error) => {
    let current = dashboardStore.get();
    dashboardStore.set({ ...current, error: error });
};
