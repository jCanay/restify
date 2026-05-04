import { persistentAtom } from "@nanostores/persistent";

const INITIAL_SETUP_DATA = {
    name: "",
    addresses: [
        {
            streetAddress: "",
            city: "",
            country: "",
            zipCode: "",
            latitude: 0,
            longitude: 0,
        },
    ],
    deliveryRadius: 2000,
    schedule: [
        {
            dayOfWeek: 0,
            isClosed: true,
            slots: [],
        },
        {
            dayOfWeek: 1,
            isClosed: true,
            slots: [],
        },
        {
            dayOfWeek: 2,
            isClosed: true,
            slots: [],
        },
        {
            dayOfWeek: 3,
            isClosed: true,
            slots: [],
        },
        {
            dayOfWeek: 4,
            isClosed: true,
            slots: [],
        },
        {
            dayOfWeek: 5,
            isClosed: true,
            slots: [],
        },
        {
            dayOfWeek: 6,
            isClosed: true,
            slots: [],
        },
    ],
};

export const $hasAnimatedConfirmation = persistentAtom(
    "hasAnimatedConfirmation",
    false,
);

export const $setupDataStore = persistentAtom("setupData", INITIAL_SETUP_DATA, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const setSetupDataName = (name) => {
    const current = $setupDataStore.get();
    $setupDataStore.set({
        ...current,
        name: name,
    });
};

export const setSetupDataRadius = (deliveryRadius) => {
    const current = $setupDataStore.get();
    $setupDataStore.set({
        ...current,
        deliveryRadius: deliveryRadius,
    });
};

export const setSetupDataAddress = ({
    streetAddress,
    city,
    country,
    zipCode,
}) => {
    const current = $setupDataStore.get();
    $setupDataStore.set({
        ...current,
        addresses: [
            {
                streetAddress: streetAddress,
                city: city,
                country: country,
                zipCode: zipCode,
            },
        ],
    });
};

export const setSetupDataLocation = ({ latitude, longitude }) => {
    const current = $setupDataStore.get();
    $setupDataStore.set({
        ...current,
        address: {
            ...current.address,
            latitude: latitude,
            longitude: longitude,
        },
    });
};

export const setSetupDataSchedule = (schedule) => {
    const current = $setupDataStore.get();
    $setupDataStore.set({
        ...current,
        schedule: schedule,
    });
};

export const deleteSetupDataKey = () => {
    $setupDataStore.set(INITIAL_SETUP_DATA);
    localStorage.removeItem("setupData");
};

export const deleteHasAnimatedConfirmationKey = () => {
    $hasAnimatedConfirmation.set(undefined);
};
