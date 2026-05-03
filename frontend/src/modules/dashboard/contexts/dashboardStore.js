import { atom } from "nanostores"

export const $dashboardStore = atom({ dashboard: {}, users: [] })

export const setDashboard = ({ dashboard }) => {
  const current = $dashboardStore.get()
  $dashboardStore.set({ ...current, dashboard })
}

export const setDashboardUsers = ({ users }) => {
  const current = $dashboardStore.get()
  $dashboardStore.set({ ...current, users })
}
