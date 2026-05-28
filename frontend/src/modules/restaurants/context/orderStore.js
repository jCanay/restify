import { persistentAtom } from "@nanostores/persistent"

const DEFAULT_DATA = {
  items: [],
  address: {},
  restaurantId: "",
  accountId: "",
  payment: {
    amount: "",
    method: "",
  },
}

export const $orderStore = persistentAtom("order", DEFAULT_DATA, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const setOrder = ({
  items = [],
  restaurantId = "",
  accountId = "",
  payment = {},
}) => {
  const current = $orderStore.get()

  $orderStore.set({ ...current, items, restaurantId, accountId, payment })
}

export const setOrderItems = (items = []) => {
  const current = $orderStore.get()

  $orderStore.set({ ...current, items })
}

export const setOrderPayment = (amount, method) => {
  const current = $orderStore.get()

  $orderStore.set({ ...current, payment: { amount, method } })
}

export const setOrderIds = (restaurantId, accountId) => {
  const current = $orderStore.get()

  $orderStore.set({ ...current, restaurantId, accountId })
}
