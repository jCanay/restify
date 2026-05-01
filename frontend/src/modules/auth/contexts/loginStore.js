import { atom } from "nanostores"

export const $loginStore = atom({ identifier: "", password: "" })

export const $loginResponseStore = atom({
  token: "",
})

export const setLogin = ({ identifier, password }) => {
  const current = $loginStore.get()
  $loginStore.set({ ...current, identifier: identifier, password: password })
}

export const setLoginIdentifier = (identifier) => {
  const current = $loginStore.get()
  $loginStore.set({ ...current, identifier: identifier })
}

export const setLoginPassword = (password) => {
  const current = $loginStore.get()
  $loginStore.set({ ...current, password: password })
}

export const setLoginResponse = ({ token }) => {
  const current = $loginResponseStore.get()
  $loginResponseStore.set({ ...current, token })
}
