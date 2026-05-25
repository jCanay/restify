import BookingGeneralSummary from "../booking/GeneralSummary/BookingGeneralSummary";
import BookingLast from "../booking/Last/BookingLast";
import BookingToday from "../booking/Today/BookingToday";
import OrderBestSelling from "../order/BestSelling/OrderBestSelling";
import OrderGeneralSummary from "../order/GeneralSummary/OrderGeneralSummary";
import OrderLast from "../order/Last/OrderLast";
import OrderSalesPerformance from "../order/SalesPerformance/OrderSalesPerformance";
import CrudManager from "./CrudManager";

export const WIDGET_REGISTRY = {
	CRUD_MANAGER: CrudManager,

	BOOKING_GENERAL_SUMMARY: BookingGeneralSummary,
	BOOKING_LAST: BookingLast,
	BOOKING_TODAY: BookingToday,

	ORDER_GENERAL_SUMMARY: OrderGeneralSummary,
	ORDER_LAST: OrderLast,
	ORDER_BEST_SELLING: OrderBestSelling,
	ORDER_SALES_PERFORMANCE: OrderSalesPerformance
};
