import { deburr, flow, kebabCase, lowerCase } from "lodash"

export const normalizeUrlString = flow(deburr, lowerCase, kebabCase)

export const formatCurrency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})
