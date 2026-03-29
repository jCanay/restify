import { atom } from "nanostores";

export const $registerStore = atom({
	name: "",
	surname: "",
	username: "",
	email: "",
	password: "",
	role: {
		name: "",
	},
});
// https://shadcn-country-dropdown.vercel.app/
export const setRegisterRoleName = (roleName) => {
	const current = $registerStore.get();
	$registerStore.set({
		...current,
		role: { name: roleName }
	});
};