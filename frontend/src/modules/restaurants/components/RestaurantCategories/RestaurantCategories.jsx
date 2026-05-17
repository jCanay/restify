import "./css/restaurant-categories.css";
import asian from "@/modules/restaurants/assets/asian.svg";
import bubbleTea from "@/modules/restaurants/assets/bubble-tea.svg";
import burguer from "@/modules/restaurants/assets/burguer.svg";
import chicken from "@/modules/restaurants/assets/chicken.svg";
import coffee from "@/modules/restaurants/assets/coffee.svg";
import indian from "@/modules/restaurants/assets/indian.svg";
import italian from "@/modules/restaurants/assets/italian.svg";
import mediterranean from "@/modules/restaurants/assets/mediterranean.svg";
import pizza from "@/modules/restaurants/assets/pizza.svg";
// import ramen from "@/modules/restaurants/assets/ramen.svg";
import sushi from "@/modules/restaurants/assets/sushi.svg";
import taco from "@/modules/restaurants/assets/taco.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export default function RestaurantCategories() {
	const carouselRef = useRef(null);

	const categories = [
		{ name: "BURGUER", label: "Hamburguesas", img: burguer },
		{ name: "PIZZA", label: "Pizzas", img: pizza },
		{ name: "CHICKEN", label: "Pollo", img: chicken },
		{ name: "MEXICAN", label: "Mexicana", img: taco },
		{ name: "ITALIAN", label: "Italiana", img: italian },
		{ name: "MEDITERRANEAN", label: "Mediterránea", img: mediterranean },
		{ name: "ASIAN", label: "Asiática", img: asian },
		{ name: "INDIAN", label: "India", img: indian },
		{ name: "SUSHI", label: "Sushi", img: sushi },
		{ name: "COFFEE", label: "Café", img: coffee },
		{ name: "BUBBLE_TEA", label: "Bubble Tea", img: bubbleTea },
	];

	const handleScroll = (direction) => {
		if (carouselRef.current) {
			// 1. Cogemos la primera tarjeta dentro de la lista
			const firstCard = carouselRef.current.querySelector("li.card");

			if (firstCard) {
				// 2. Calculamos el ancho total que ocupa (ancho real + el gap/margen que tiene)
				const cardWidth = firstCard.offsetWidth;

				// Obtenemos el gap real leyendo los estilos computados del contenedor (ul)
				const computedStyle = window.getComputedStyle(carouselRef.current);
				const gap = parseFloat(computedStyle.gap) || 0;

				// La distancia exacta para avanzar una tarjeta completa de forma limpia
				const scrollStep = cardWidth + gap;

				// 3. Ejecutamos el scroll matemático exacto
				if (direction === "left") {
					carouselRef.current.scrollLeft -= scrollStep;
				} else {
					carouselRef.current.scrollLeft += scrollStep;
				}
			}
		}
	};

	const handleClick = (name) => {
		console.log(name);

	};

	return (
		<div className="restaurant-categories">
			<button
				type="button"
				className="carousel-btn left"
				onClick={() => handleScroll("left")}
				aria-label="Desplazar a la izquierda"
			>
				<ChevronLeft />
			</button>
			<ul ref={carouselRef} className="restaurant-categories">
				{categories.map(({ name, label, img }, i) => (
					<li key={i} className="card" >
						<button onClick={() => handleClick(name)}>
							<img src={img} alt="" width={60} />
							<span className="w-full text-center font-medium truncate px-1 ">{label}</span>
						</button>
					</li>
				))}
			</ul>
			<button
				type="button"
				className="carousel-btn right"
				onClick={() => handleScroll("right")}
				aria-label="Desplazar a la derecha"
			>
				<ChevronRight />
			</button>
		</div>
	);
}