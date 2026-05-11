import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, Search, Trash } from "lucide-react";
import BookingCrudManager from "../booking/CrudManager/BookingCrudManager";
import "./css/crud-manager.css";
import Widget from "./Widget";
import { useState } from "react";

function CrudManager({ pageId }) {
	const [activeType, setActiveType] = useState(null);
	const [open, setOpen] = useState(false);
	const names = {
		bookings: {
			singular: "reserva",
			plural: "reservas",
			content: BookingCrudManager,
		},
	};

	const Content = names[pageId]?.content;
	const openModal = (type) => {
		setActiveType(type);
		setOpen(true);
	};

	return (
		<Widget className={"crud-manager"} title={`Gestionar ${names[pageId]?.plural ?? "[name]"}`}>
			<ul>
				<button className="box" onClick={() => openModal("add")}>
					<Plus /> Añadir {names[pageId]?.singular ?? "[name]"}
				</button>
				<button className="box" onClick={() => openModal("search")}>
					<Search /> Buscar {names[pageId]?.singular ?? "[name]"}
				</button>
				<button className="box" onClick={() => openModal("edit")}>
					<Pencil /> Actualizar {names[pageId]?.singular ?? "[name]"}
				</button>
				<button className="box" onClick={() => openModal("delete")}>
					<Trash /> Eliminar {names[pageId]?.singular ?? "[name]"}
				</button>

				{/* UN SOLO DIALOG PARA TODOS */}
				<Dialog open={open} onOpenChange={setOpen ?? "[name]"}>
					{/* Solo renderizamos el contenido si hay un tipo activo */}
					{open && activeType && (
						<Content type={activeType} setOpen={setOpen ?? "[name]"} />
					)}
				</Dialog>
			</ul>
		</Widget>
	);
}

export default CrudManager;
