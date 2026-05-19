import Logo from "@/modules/core/components/Logo";
import "./css/restaurants-navbar.css";
import { useEffect, useState } from "react";
import AccountMenu from "@/modules/core/components/AccountMenu/AccountMenu";

export default function RestaurantsNavbar({ city, onInputChange }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <nav className={`restaurants-navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="wrapper container">
                <Logo route={"/"} />
                <input
                    type="search"
                    name=""
                    id=""
                    placeholder={`Buscar restaurantes${city ? ` en ${capitalize(city)}` : ""}`}
                    onChange={(e) => onInputChange(e.target.value)}
                />
                <AccountMenu />
            </div>
        </nav>
    );
}
