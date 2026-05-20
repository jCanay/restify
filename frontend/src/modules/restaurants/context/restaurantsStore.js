import { persistentAtom } from "@nanostores/persistent";

const INITIAL_DATA = { countryCode: "", city: "", restaurants: [] };

export const $restaurantsStore = persistentAtom("restaurants", INITIAL_DATA, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const setRestaurants = ({ countryCode, city, restaurants }) => {
    const current = $restaurantsStore.get();
    $restaurantsStore.set({ ...current, countryCode, city, restaurants });
};

export const restaurantsExists = () => {
    const current = $restaurantsStore.get();
    return current.countryCode && current.city && current.restaurants;
};

export const deleteRestaurantsKey = () => {
    $restaurantsStore.set(INITIAL_DATA);
    localStorage.removeItem("restaurants");
};
