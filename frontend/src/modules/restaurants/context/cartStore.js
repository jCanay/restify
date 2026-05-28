import { persistentAtom } from "@nanostores/persistent"

const DEFAULT_DATA = {
  restaurantId: "",
  shippingCosts: 0,
  paymentMethod: "",
  items: [],
}

export const $cartStore = persistentAtom("cart", DEFAULT_DATA, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const addItemToCart = (newItem = {}) => {
  const current = $cartStore.get()

  const itemExists = current.items.some((item) => item.id === newItem.id)

  let newItems

  if (itemExists) {
    newItems = current.items.map((item) =>
      item.id === newItem.id ?
        { ...item, quantity: item.quantity + newItem.quantity }
      : item,
    )
  } else {
    newItems = [...current.items, { ...newItem, quantity: newItem.quantity }]
  }

  $cartStore.set({ ...current, items: newItems })
}

export const updateItemQuantity = (id, quantity) => {
  const current = $cartStore.get()

  if (quantity <= 0) {
    removeItemFromCart(id)
    return
  }

  const newItems = current.items.map((item) =>
    item.id === id ? { ...item, quantity: quantity } : item,
  )

  $cartStore.set({ ...current, items: newItems })
}

export const removeItemFromCart = (itemId = -1) => {
  const current = $cartStore.get()
  const newItems = current.items.filter((i) => i.id != itemId)
  $cartStore.set({ ...current, items: newItems })
}

export const setShippingCosts = (shippingCosts) => {
  const current = $cartStore.get()

  $cartStore.set({ ...current, shippingCosts })
}

export const getTotalItems = () => {
  const current = $cartStore.get()
  let total = 0

  current.items.forEach((item) => {
    total += item.quantity
  })

  return total
}

export const getItemCountById = (id) => {
  const current = $cartStore.get()

  let total = 0

  current.items.forEach((item) => {
    if (item.id === id) {
      total += item.quantity
    }
  })

  return total
}

export const getItemTotalPrice = () => {
  const current = $cartStore.get()

  let total = 0
  current.items.forEach((item) => {
    total += item.price * item.quantity
  })

  return total
}

export const getCheckoutTotal = () => {
  const current = $cartStore.get()

  return getItemTotalPrice() + current.shippingCosts || 0
}
