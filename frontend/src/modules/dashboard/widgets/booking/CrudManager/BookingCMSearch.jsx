import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import "./css/booking-cm-search.css";
import { useEffect, useMemo, useState } from "react";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";

export default function BookingCMSearch() {
	const { getAllBookings, loading, error } = useBookings();
	const modules = [AllCommunityModule];
	const [rowData, setRowData] = useState(null);
	const colDefs = useMemo(() => [
		{ field: "status", headerName: "Estado", width: 150 },
		{ field: "name", headerName: "Nombre", minWidth: 100, width: 275 },
		{ field: "date", headerName: "Fecha", minWidth: 75, width: 110 },
		{ field: "time", headerName: "Hora", minWidth: 75, width: 100 },
		{ field: "createdAt", headerName: "Tiempo desde creación", width: 235, resizable: false },
	], []);

	const parseBookings = (bookings) => {
		const parsedBookings = [];

		bookings.forEach((e) => {
			parsedBookings.push({
				status: e.status,
				name: `${e.account.name} ${e.account.surname}`,
				date: new Date(e.bookingDate),
				time: new Date(e.bookingDate),
				createdAt: new Date(e.createdAt).toLocaleString()
			});
		});

		return parsedBookings;
	};

	useEffect(() => {
		const loadBookings = async () => {
			const response = await getAllBookings();

			if (response && response.content) {
				const parsed = parseBookings(response.content);
				setRowData(parsed);
			}
		};

		loadBookings();
	}, [getAllBookings]);

	return (
		<DialogContent className="booking-crud-manager search">
			<DialogTitle>Buscar reserva</DialogTitle>
			<DialogDescription>Introduce los datos de la reserva que quieras buscar.</DialogDescription>
			<AgGridProvider modules={modules}>
				<div className="table ag-theme-quartz" onWheel={(e) => e.stopPropagation()}>
					<AgGridReact
						paginationAutoPageSize
						pagination
						localeText={AG_GRID_LOCALE_ES}
						rowData={rowData}
						columnDefs={colDefs}
						animateColumnResizing
						colResizeDefault="shift"
						autoSizeStrategy={{
							type: "fitGridWidth",
						}}
					/>
				</div>
			</AgGridProvider>
			{/* <AgGridReact columnDefs={[{ suppressAutoSize: true, }]} /> */}
		</DialogContent>
	);
}