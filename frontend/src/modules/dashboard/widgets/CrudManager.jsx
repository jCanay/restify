import { GripVertical, Pencil, Plus, Search, Trash } from "lucide-react";
import "../css/crud-manager.css";

function CrudManager({ name, pluralName }) {
	return (
		<div className="crud-manager">
			<section className="header">
				<div className="drag-handle">
					<GripVertical />
				</div>
				<h3>Gestionar {pluralName}</h3>
			</section>
			<section className="body">
				<button className="box">
					<Plus />
					Añadir {name}
				</button>
				<button className="box">
					<Search />
					Buscar {name}
				</button>
				<button className="box">
					<Pencil />
					Actualizar {name}
				</button>
				<button className="box">
					<Trash />
					Eliminar {name}
				</button>
			</section>
		</div>
	);
}

export default CrudManager;
