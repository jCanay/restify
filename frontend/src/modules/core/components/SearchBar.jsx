import React, { useState, useEffect, useRef } from "react";
import "../css/search-bar.css";

const MAPTILER_KEY = "QkO3eLDUFMUxb3ecqiD8";

const SearchBar = ({ onSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [focused, setFocused] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchAddresses(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation([
                    position.coords.longitude,
                    position.coords.latitude,
                ]);
            },
            (error) => console.log("Geolocalización desactivada"),
            { enableHighAccuracy: true },
        );
    }, []);

    const fetchAddresses = async (searchQuery) => {
        setLoading(true);
        try {
            let url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_KEY}&language=es&limit=5&country=es`;

            if (userLocation) {
                url += `&proximity=${userLocation[0]},${userLocation[1]}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("MapTiler error");

            const data = await response.json();
            setResults(data.features || []);
        } catch (error) {
            console.error("Fallo en MapTiler:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // English: If the click is outside the searchContainerRef, hide results
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = (feature) => {
        // 1. Extraemos las coordenadas [longitud, latitud]
        const [longitude, latitude] = feature.geometry.coordinates;

        // 2. Buscamos el nombre de la ciudad en el contexto (opcional pero recomendado)
        const cityContext = feature.context?.find((ctx) =>
            ctx.id.startsWith("place"),
        );
        const cityName = cityContext ? cityContext.text : feature.text;

        // 3. Creamos el objeto de datos que necesita tu App
        const selectionData = {
            city: cityName,
            address: feature.place_name,
            latitude: latitude,
            longitude: longitude,
        };

        // 4. Actualizamos la interfaz
        setQuery(feature.place_name);
        setResults([]);

        // 5. Enviamos todo al padre (Dashboard / App)
        if (onSelect instanceof Function) {
            onSelect(selectionData);
        }
    };

    return (
        <div className="search-bar-directions" ref={searchContainerRef}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={"Introduce tu dirección"}
                onFocus={() => setFocused(true)}
            />

            {results.length > 0 && focused && (
                <ul className="results-dropdown">
                    {results.map((feature) => (
                        <li key={feature.id}>
                            <button onClick={() => handleClick(feature)}>
                                <div className="item-content">
                                    <strong>{feature.text}</strong>
                                    <small>{feature.place_name}</small>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
