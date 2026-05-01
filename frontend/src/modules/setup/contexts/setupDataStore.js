import { atom } from "nanostores";
// import { persistentAtom } from '@nanostores/persistent';

export const $hasAnimatedConfirmation = atom(false);

export const $setupDataStore = atom({
	name: "",
	address: {
		street: "",
		city: "",
		country: "",
		zipcode: "",
		latitude: 0,
		longitude: 0
	},
	radius: 2000,
	schedule: [
		{
			dayOfWeek: 0,
			isClosed: true,
			slots: []
		},
		{
			dayOfWeek: 1,
			isClosed: true,
			slots: []
		},
		{
			dayOfWeek: 2,
			isClosed: true,
			slots: []
		},
		{
			dayOfWeek: 3,
			isClosed: true,
			slots: []
		},
		{
			dayOfWeek: 4,
			isClosed: true,
			slots: []
		},
		{
			dayOfWeek: 5,
			isClosed: true,
			slots: []
		},
		{
			dayOfWeek: 6,
			isClosed: true,
			slots: []
		},
	]
});

export const setSetupDataName = (name) => {
	const current = $setupDataStore.get();
	$setupDataStore.set({
		...current,
		name: name
	});
};

export const setSetupDataRadius = (radius) => {
	const current = $setupDataStore.get();
	$setupDataStore.set({
		...current,
		radius: radius
	});
};

export const setSetupDataAddress = ({ street, city, country, zipcode }) => {
	const current = $setupDataStore.get();
	$setupDataStore.set({
		...current,
		address: {
			...current.address,
			street: street,
			city: city,
			country: country,
			zipcode: zipcode
		}
	});
};

export const setSetupDataLocation = ({ latitude, longitude }) => {
	const current = $setupDataStore.get();
	$setupDataStore.set({
		...current,
		address: {
			...current.address,
			latitude: latitude,
			longitude: longitude
		}
	});
};

export const setSetupDataSchedule = (schedule) => {
	const current = $setupDataStore.get();
	$setupDataStore.set({
		...current,
		schedule: schedule
	});
};