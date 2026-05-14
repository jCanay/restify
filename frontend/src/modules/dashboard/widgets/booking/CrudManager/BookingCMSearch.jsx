import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import "./css/booking-cm-search.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { Badge } from "@/components/ui/badge";
import {
    BadgeCheck,
    BadgeMinus,
    BadgeQuestionMark,
    BadgeX,
    Pencil,
} from "lucide-react";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import {
    $userStore,
    getUserDefaultRestaurant,
} from "@/modules/dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";
import RelativeTime from "@/modules/dashboard/components/RelativeTime";
import { GridDayPickerEditor } from "@/modules/dashboard/components/GridDayPickerEditor";

export default function BookingCMSearch() {
    const { getAllBookingsByRestaurantId, loading, error } = useBookings();
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
            canceled: {
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

    const colDefs = useMemo(
        () => [
            {
                field: "status",
                headerName: "Estado",
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
            {
                field: "date",
                headerName: "Fecha",
                colId: "bookingDate",
                editable: true,
                cellEditor: GridDayPickerEditor,
                cellEditorPopup: true,
                cellEditorPopupPosition: "under",
                enableCellChangeFlash: true,
                cellClass: "editable-cell-style",
            },
            {
                field: "time",
                headerName: "Hora",
                colId: "bookingDate_1",
                editable: true,
                enableCellChangeFlash: true,
                cellClass: "editable-cell-style",
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
        [STATUS_CONFIG],
    );

    const parseBookings = useMemo(
        () => (bookings) => {
            return bookings.map((e) => {
                const bookingDate = new Date(e.bookingDate);

                const isCurrentUser = e.user?.username === user?.username;
                const displayName = e.account?.name
                    ? `${e.account.name} ${e.account.surname}`
                    : isCurrentUser
                      ? `${e.user.username} (Tú)`
                      : e.user.username;

                return {
                    id: e.id,
                    status: e.status.toLowerCase(),
                    name: displayName,
                    date: format(bookingDate, "dd/MM/yyyy", { locale: es }),
                    time: format(bookingDate, "HH:mm"),
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

                const response = await getAllBookingsByRestaurantId(
                    getUserDefaultRestaurant()?.id,
                    {
                        page: page,
                        size: size,
                        sort: sortString,
                        search: searchText,
                    },
                );

                if (response && response.content) {
                    const parsed = parseBookings(response.content);

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

    // Manejador del buscador
    const onFilterTextBoxChanged = (e) => {
        const value = e.target.value;
        setSearchText(value);
        gridRef.current.api.refreshInfiniteCache();
    };

    const onSelectionChanged = (event) => {
        // Obtenemos los nodos seleccionados
        const selectedNodes = event.api.getSelectedNodes();

        // Obtenemos los datos (el objeto que parseaste en parseBookings)
        const selectedData = selectedNodes.map((node) => node.data);

        if (selectedData.length > 0) {
            console.log("Reserva seleccionada:", selectedData[0]);
            // Aquí puedes guardar el valor en un estado o ejecutar una acción
            // setSelectedBooking(selectedData[0]);
        } else {
            console.log("No hay nada seleccionado");
        }
    };

    const onCellValueChanged = (event) => {
        // Si usaste setDataValue, este log DEBE aparecer ahora
        console.log("¡POR FIN! Cambio detectado:", event.newValue);

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

            // Opcional: También podrías querer limpiar el foco de la celda actual
            gridRef.current.api.clearFocusedCell();
        }
    };

    return (
        <DialogContent
            className="booking-crud-manager search"
            onOpenAutoFocus={(e) => {
                e.preventDefault();
                e.currentTarget.focus();
            }}
        >
            <DialogTitle>Buscar reserva</DialogTitle>
            <DialogDescription>
                Introduce los datos de la reserva que quieras buscar.
            </DialogDescription>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Busca algo..."
                    onChange={onFilterTextBoxChanged}
                />
                <button type="button" onClick={handleEdit}>
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
