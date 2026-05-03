import { atom } from "nanostores"

export const $registerStore = atom({
  account: {
    name: "",
    surname: "",
  },
  user: {
    username: "",
    email: "",
    role: {
      name: "ROLE_USER",
    },
  },
  password: "",
})

// https://shadcn-country-dropdown.vercel.app/
export const setRegisterRoleName = (name) => {
  const current = $registerStore.get()
  $registerStore.set({
    ...current,
    user: { ...current.user, role: { name } },
  })
}

export const setRegister = (newValue) => {
  const current = $registerStore.get()
  $registerStore.set({
    ...current,
    ...newValue,
    user: { ...current.user, ...newValue.user },
    account: { ...current.account, ...newValue.account },
  })
}
