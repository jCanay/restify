import {
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import "./css/order-cm-search.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { Badge } from "@/components/ui/badge";
import {
	BadgeCheck,
	BadgeMinus,
	BadgeQuestionMark,
	BadgeX,
	Pencil,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
	$userStore,
	getUserDefaultRestaurant,
} from "@/modules/dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";
import RelativeTime from "@/modules/dashboard/components/RelativeTime";
import { GridDayPickerEditor } from "@/modules/dashboard/components/GridDayPickerEditor";
import { themeQuartz } from "ag-grid-community";
import { useOrders } from "@/modules/restaurants/hooks/useOrders";
import { formatCurrency } from "@/modules/restaurants/utils/stringParser";

export default function OrderCMSearch() {
	const { getAllOrdersByRestaurantId, loading, error } = useOrders();
	const { user } = useStore($userStore);
	const [searchText, setSearchText] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const gridRef = useRef();

	const STATUS_CONFIG = useMemo(
		() => ({
			pending: {
				label: "Pendiente",
				className:
					"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
				icon: <BadgeMinus strokeWidth={2.75} />,
			},
			accepted: {
				label: "Aceptada",
				className:
					"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
				icon: <BadgeCheck strokeWidth={2.75} />,
			},
			cancelled: {
				label: "Cancelada",
				className:
					"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
				icon: <BadgeX strokeWidth={2.75} />,
			},
			unknown: {
				label: "Desconocido",
				className:
					"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
				icon: <BadgeQuestionMark strokeWidth={2.75} />,
			},
		}),
		[],
	);

	const PAYMENT_STATUS_CONFIG = useMemo(
		() => ({
			pending: {
				label: "Pendiente",
				className:
					"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
				icon: <BadgeMinus strokeWidth={2.75} />,
			},
			paid: {
				label: "Aceptado",
				className:
					"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
				icon: <BadgeCheck strokeWidth={2.75} />,
			},
			failed: {
				label: "Cancelado",
				className:
					"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
				icon: <BadgeX strokeWidth={2.75} />,
			},
			unknown: {
				label: "Desconocido",
				className:
					"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
				icon: <BadgeQuestionMark strokeWidth={2.75} />,
			},
		}),
		[],
	);

	const colDefs = useMemo(
		() => [
			{
				field: "status",
				headerName: "Estado del pedido",
				getQuickFilterText: (params) => {
					const config =
						STATUS_CONFIG[params.value] || STATUS_CONFIG.unknown;

					return config.label;
				},
				cellRenderer: (params) => {
					if (!params.data) return null;

					const config =
						STATUS_CONFIG[params.value] || STATUS_CONFIG.unknown;

					return (
						<div className="flex h-full items-center">
							<Badge className={`badge ${config.className} `}>
								{config.icon}
								{config.label}
							</Badge>
						</div>
					);
				},
			},
			{ field: "name", headerName: "Nombre", colId: "account.name" },
			{ field: "total", headerName: "Total", colId: "payment.amount" },
			{
				field: "paymentStatus",
				headerName: "Estado del Pago",
				getQuickFilterText: (params) => {
					const config =
						PAYMENT_STATUS_CONFIG[params.value] || PAYMENT_STATUS_CONFIG.unknown;

					return config.label;
				},
				cellRenderer: (params) => {
					if (!params.data) return null;

					const config =
						PAYMENT_STATUS_CONFIG[params.value] || PAYMENT_STATUS_CONFIG.unknown;

					return (
						<div className="flex h-full items-center">
							<Badge className={`badge ${config.className} `}>
								{config.icon}
								{config.label}
							</Badge>
						</div>
					);
				},
			},
			{
				field: "createdAt",
				headerName: "Tiempo desde creación",
				width: 300,
				resizable: false,
				sort: "desc",
				getQuickFilterText: () => "",
				cellRenderer: (params) => {
					if (!params.data) return null;

					return <RelativeTime timestamp={params.value} />;
				},
			},
		],
		[STATUS_CONFIG, PAYMENT_STATUS_CONFIG],
	);

	const parseOrders = useMemo(
		() => (orders) => {
			return orders.map((e) => {
				const isCurrentUser = e.user?.username === user?.username;
				const displayName = e.account?.name
					? `${e.account.name} ${e.account.surname}`
					: isCurrentUser
						? `${e.user.username} (Tú)`
						: e.user.username;

				return {
					id: e.id,
					status: e.status.toLowerCase(),
					paymentStatus: e.payment.status.toLowerCase(),
					name: displayName,
					total: formatCurrency.format(e.payment.amount),
					createdAt: e.createdAt,
				};
			});
		},
		[user],
	);

	const onGridReady = (params) => {
		const dataSource = {
			rowCount: undefined,
			getRows: async (getRowsParams) => {
				const size = 20;
				const page = getRowsParams.startRow / size;

				let sortString = "";
				if (getRowsParams.sortModel.length > 0) {
					const { colId, sort } = getRowsParams.sortModel[0];
					const cleanColId = colId.replace(/_\d+$/, "");
					sortString = `${cleanColId},${sort}`;
				}

				const response = await getAllOrdersByRestaurantId(
					getUserDefaultRestaurant()?.id,
					{
						page: page,
						size: size,
						sort: sortString,
						search: searchText,
					},
				);

				console.log(response);


				if (response && response.content) {
					const parsed = parseOrders(response.content);

					let lastRow = -1;
					if (response.totalElements <= getRowsParams.endRow) {
						lastRow = response.totalElements;
					}

					getRowsParams.successCallback(parsed, lastRow);
				}
			},
		};
		params.api.setGridOption("datasource", dataSource);
	};

	// Función del buscador
	const onFilterTextBoxChanged = (e) => {
		const value = e.target.value;
		setSearchText(value);
		gridRef.current.api.refreshInfiniteCache();
	};

	const onSelectionChanged = (event) => {
		// Obtenemos los nodos seleccionados
		const selectedNodes = event.api.getSelectedNodes();

		// Obtenemos los datos
		const selectedData = selectedNodes.map((node) => node.data);

		if (selectedData.length > 0) {
			console.log("Pedido seleccionada:", selectedData[0]);
		} else {
			console.log("No hay nada seleccionado");
		}
	};

	const onCellValueChanged = (event) => {
		if (event.column.getColId() === "bookingDate") {
			// Lógica de guardado en API
		}
	};

	useEffect(() => {
		if (gridRef.current && gridRef.current.api) {
			gridRef.current.api.refreshHeader();
			gridRef.current.api.sizeColumnsToFit();
		}
	}, [isEditing]);

	const handleEdit = () => {
		setIsEditing(!isEditing);

		if (gridRef.current && gridRef.current.api) {
			gridRef.current.api.deselectAll();
			gridRef.current.api.clearFocusedCell();
		}
	};

	return (
		<DialogContent
			className="order-crud-manager search"
			onOpenAutoFocus={(e) => {
				e.preventDefault();
				e.currentTarget.focus();
			}}
		>
			<DialogTitle>Buscar pedido</DialogTitle>
			<DialogDescription>
				Introduce los datos del pedido que quieras buscar.
			</DialogDescription>
			<div className="search-bar">
				<input
					type="text"
					placeholder="Busca algo..."
					onChange={onFilterTextBoxChanged}
				/>
				<button
					type="button"
					className={`${isEditing ? "editing" : ""}`}
					onClick={handleEdit}
				>
					<Pencil size={16} />
					<span>Editar</span>
				</button>
			</div>
			<AgGridProvider modules={[AllCommunityModule]}>
				<div className="table">
					<AgGridReact
						className={`${isEditing ? "editing" : ""}`}
						ref={gridRef}
						rowModelType="infinite"
						rowBuffer={0}
						cacheBlockSize={20}
						cacheOverflowSize={1}
						maxConcurrentDatasourceRequests={1}
						infiniteInitialRowCount={1}
						maxBlocksInCache={100}
						// blockLoadDebounceMillis={500}
						cacheQuickFilter
						getRowId={(params) => params.data.id.toString()}
						rowSelection={{
							mode: "singleRow",
							enableClickSelection: isEditing,
							checkboxes: isEditing,
							headerCheckbox: true,
						}}
						onCellValueChanged={onCellValueChanged}
						onSelectionChanged={onSelectionChanged}
						onGridReady={onGridReady}
						localeText={AG_GRID_LOCALE_ES}
						columnDefs={colDefs}
						colResizeDefault="shift"
						onFirstDataRendered={(params) =>
							params.api.sizeColumnsToFit()
						}
					/>
				</div>
			</AgGridProvider>
			{/* <AgGridReact columnDefs={[{ suppressAutoSize: true}]} /> */}
		</DialogContent>
	);
}
