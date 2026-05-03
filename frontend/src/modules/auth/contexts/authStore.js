import { persistentAtom } from "@nanostores/persistent"

export const $authStore = persistentAtom(
  "auth",
  { token: "" },
  { encode: JSON.stringify, decode: JSON.parse },
)

export const setAuth = ({ token }) => {
  const current = $authStore.get()
  $authStore.set({ ...current, token })
}

export const deleteAuthKey = () => {
  $authStore.set(undefined)
}
