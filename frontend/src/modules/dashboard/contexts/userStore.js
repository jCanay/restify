import { atom } from "nanostores"
import { persistentAtom } from "@nanostores/persistent"

export const $userStore = persistentAtom(
  "user",
  {
    user: { username: "", email: "", role: { name: "" } },
    account: { name: "", surname: "", profilePicture: "", addresses: [] },
  },
  { encode: JSON.stringify, decode: JSON.parse },
)

export const setUser = ({ user, account }) => {
  const current = $userStore.get()
  $userStore.set({ ...current, user, account })
}
