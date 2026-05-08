import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, Search, Trash } from "lucide-react";
import BookingCrudManager from "../booking/BookingCrudManager";
import "./css/crud-manager.css";
import Widget from "./Widget";

function CrudManager({ pageId }) {
    const names = {
        bookings: {
            singular: "reserva",
            plural: "reservas",
            content: BookingCrudManager,
        },
    };

    const Content = names[pageId]?.content;

    return (
        <Widget
            className="crud-manager"
            title={`Gestionar ${names[pageId]?.plural ?? "[name]"}`}
        >
            <ul>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="box">
                            <Plus />
                            Añadir {names[pageId]?.singular ?? "[name]"}
                        </button>
                    </DialogTrigger>
                    <Content type="add" />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="box">
                            <Search />
                            Buscar {names[pageId]?.singular ?? "[name]"}
                        </button>
                    </DialogTrigger>
                    <Content type="search" />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="box">
                            <Pencil />
                            Actualizar {names[pageId]?.singular ?? "[name]"}
                        </button>
                    </DialogTrigger>
                    <Content type="edit" />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="box">
                            <Trash />
                            Eliminar {names[pageId]?.singular ?? "[name]"}
                        </button>
                    </DialogTrigger>
                    <Content type="delete" />
                </Dialog>
            </ul>
        </Widget>
    );
}

export default CrudManager;
