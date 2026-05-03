import { persistentAtom } from "@nanostores/persistent"

export const $userStore = persistentAtom(
  "user",
  {
    user: { id: "", username: "", email: "", role: { name: "" } },
    account: {
      id: "",
      name: "",
      surname: "",
      profilePicture: "",
      addresses: [],
      onboardingCompleted: false,
    },
    restaurants: [{ id: "", name: "", deliveryRadius: 0 }],
  },
  { encode: JSON.stringify, decode: JSON.parse },
)

export const setUser = ({ user, account, restaurants }) => {
  const current = $userStore.get()
  $userStore.set({ ...current, user, account, restaurants })
}

export const deleteUserKey = () => {
  $userStore.set(undefined)
}
