import { atom } from "nanostores";

export const $loginStore = atom({ identifier: "", password: "" });

export const $loginResponseStore = atom({
    user: { username: "", password: "", email: "", role: { name: "" } },
    token: "",
});

export const setLogin = ({ identifier, password }) => {
    const current = $loginStore.get();
    $loginStore.set({ ...current, identifier: identifier, password: password });
};

export const setLoginIdentifier = (identifier) => {
    const current = $loginStore.get();
    $loginStore.set({ ...current, identifier: identifier });
};

export const setLoginPassword = (password) => {
    const current = $loginStore.get();
    $loginStore.set({ ...current, password: password });
};

export const setLoginResponse = ({ user, token }) => {
    const current = $loginResponseStore.get();
    $loginResponseStore.set({ ...current, user, token });
};
