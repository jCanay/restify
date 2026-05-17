import { persistentAtom } from "@nanostores/persistent"

const DEFAULT_USER = {
  user: { id: "", username: "", email: "", role: { name: "" } },
  account: {
    id: "",
    name: "",
    surname: "",
    profilePicture: "",
    address: {},
    onboardingCompleted: false,
  },
  restaurants: [{ id: "", name: "", deliveryRadius: 0, isDefault: false }],
}

export const $userStore = persistentAtom("user", DEFAULT_USER, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const setUser = ({ user, account, restaurants }) => {
  const current = $userStore.get()
  $userStore.set({ ...current, user, account, restaurants })
}

export const deleteUserKey = () => {
  $userStore.set(DEFAULT_USER)
  localStorage.removeItem("user")
}

export const getUserDefaultRestaurant = () => {
  const current = $userStore.get()
  return current?.restaurants?.filter((r) => r.isDefault)[0]
}

export const userExists = () => {
  const current = $userStore.get()
  return (
    current?.user?.id &&
    current?.user?.username &&
    current?.user?.email &&
    current?.user?.role?.name
  )
}
