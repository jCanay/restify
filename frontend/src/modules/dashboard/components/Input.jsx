import "./input.css";

export default function Input({ title, type = "text" }) {
    return (
        <div className="input">
            <span>{title}</span>
            <input type={type} />
        </div>
    );
}
