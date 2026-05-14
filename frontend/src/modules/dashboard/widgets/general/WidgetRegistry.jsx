import BookingGeneralSummary from "../booking/BookingGeneralSummary";
import BookingLast from "../booking/BookingLast";
import CrudManager from "./CrudManager";

export const WIDGET_REGISTRY = {
    CRUD_MANAGER: CrudManager,
    BOOKING_GENERAL_SUMMARY: BookingGeneralSummary,
    BOOKING_LAST: BookingLast,
};
