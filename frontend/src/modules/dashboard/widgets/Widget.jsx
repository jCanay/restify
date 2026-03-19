import { GripVertical } from "lucide-react";
import "../css/widget.css";

function Widget({ children, className, title, layout }) {
    return (
        <div className={`widget ${className}`}>
            <header>
                <GripVertical className="drag-handle" />
                <h3>{title}</h3>
            </header>
            <section className="body">{children}</section>
        </div>
    );
}

export default Widget;
