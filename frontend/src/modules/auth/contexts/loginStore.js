import { atom } from "nanostores"

export const $loginStore = atom({ identifier: "", password: "" })

export const setLogin = ({ identifier, password }) => {
  const current = $loginStore.get()
  $loginStore.set({
    ...current,
    identifier,
    password,
  })
}
