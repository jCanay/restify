import { Pencil, Plus, Search, Trash } from "lucide-react";
import "../css/crud-manager.css";
import Widget from "./Widget";

function CrudManager({ name, pluralName }) {
    return (
        <Widget className="crud-manager" title={`Gestionar ${pluralName}`}>
            <ul>
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
            </ul>
        </Widget>
    );
}

export default CrudManager;
