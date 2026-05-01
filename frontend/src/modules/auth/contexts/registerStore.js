import { atom } from "nanostores"

export const $registerStore = atom({
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
  role: {
    name: "ROLE_USER",
  },
})

// https://shadcn-country-dropdown.vercel.app/
export const setRegisterRoleName = (name) => {
  const current = $registerStore.get()
  $registerStore.set({
    ...current,
    role: { name },
  })
}

export const setRegister = ({
  name,
  surname,
  username,
  email,
  password,
  role,
}) => {
  const current = $registerStore.get()
  $registerStore.set({
    ...current,
    name: name,
    surname: surname,
    username: username,
    email: email,
    password: password,
    role: role,
  })
}
