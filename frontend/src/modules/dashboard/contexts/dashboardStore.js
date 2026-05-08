import { persistentAtom } from "../../../../node_modules/@nanostores/persistent/index";

const INITIAL_DASHBOARD = { dashboard: {} };

export const $dashboardStore = persistentAtom("dashboard", INITIAL_DASHBOARD, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const setDashboard = ({ dashboard }) => {
    const current = $dashboardStore.get();
    $dashboardStore.set({ ...current, dashboard });
};

export const deleteDashboardKey = () => {
    $dashboardStore.set(INITIAL_DASHBOARD);
    localStorage.removeItem("dashboard");
};
