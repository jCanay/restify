import "../css/restaurant-detail-page.css";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import RestaurantsNavbar from "../components/RestaurantsNavbar/RestaurantsNavbar";
import { ChevronDown, Plus } from "lucide-react";
import { Breadcrums } from "../components/Breadcrums/Breadcrums";
import { Footer } from "@/modules/core/components/Footer/Footer";
import { formatCurrency, normalizeUrlString } from "../utils/stringParser";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PRODUCT_IMAGES_MOCK, RESTAURANT_IMAGES } from "../utils/constants";
import Cart from "../components/Cart/Cart";
import { $cartStore, addItemToCart, getItemCountById } from "../context/cartStore";
import Stepper from "../components/Stepper/Stepper";
import { useStore } from "@nanostores/react";
import ProductCard from "../components/ProductCard/ProductCard";

export default function RestaurantDetailPage() {
	const { getProductsByUrl, loading, error } = useProducts();
	const { countryCode, city, slug } = useParams();
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [restaurant, setRestaurant] = useState({});
	const [productOpen, setProductOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const cart = useStore($cartStore);

	const img = RESTAURANT_IMAGES[restaurant.id % RESTAURANT_IMAGES.length];

	useEffect(() => {
		const loadProducts = async () => {
			if (!countryCode || !city || !slug) {
				return;
			}

			const response = await getProductsByUrl({
				countryCode,
				city,
				slug,
			});

			setRestaurant(response.restaurant);
			setProducts(response.products);
			setFilteredProducts(response.products);
		};

		loadProducts();
	}, [countryCode, city, slug, getProductsByUrl]);

	// if (loading) {
	// 	return <div>Loading...</div>;
	// }

	// if (error || !countryCode || !city || !slug) {
	// 	return <div>Not found</div>;
	// }

	const handleProductClick = (product) => {
		setSelectedProduct(null);
		setSelectedProduct(product);
		setProductOpen(true);

		navigate(`/${countryCode}/${city}/${slug}/${normalizeUrlString(product.name)}`);
	};

	const handleProductAddClick = (e, product) => {
		e.stopPropagation();
		addItemToCart({ ...product, quantity: 1 });
	};

	const handleOpenChange = () => {
		setProductOpen(!productOpen);

		if (productOpen) {
			navigate(`/${countryCode}/${city}/${slug}`);
		}
	};

	const handleFAQToggle = (e) => {
		if (e.target.open) {
			setTimeout(() => {
				const rect = e.target.getBoundingClientRect();

				const windowHeight = window.innerHeight || document.documentElement.clientHeight;

				const isBottomOvertaking = rect.bottom > windowHeight;

				const isTopHidden = rect.top < 80;

				if (isBottomOvertaking || isTopHidden) {
					e.target.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
				}
			}, 60);
		}
	};

	const links = [
		{
			label: restaurant?.address?.city,
			url: `/${countryCode}/${city}`,
		},
		{
			label: restaurant?.name,
		},
	];

	return (
		<>
			<RestaurantsNavbar placeholder={`Buscar en ${restaurant.name}`} rightComponents={[<Cart />]} />
			<main className="restaurant-detail-page container">
				<Breadcrums links={links} />
				<header>
					<img src={img} alt="" draggable="false" />
					<h2>{restaurant.name}</h2>
				</header>
				{Object.entries(
					filteredProducts.reduce((acc, product) => {
						const cat = product.category || "Otros";
						if (!acc[cat]) acc[cat] = [];
						acc[cat].push(product);
						return acc;
					}, {}),
				).map(([categoryName, productsInCategories]) => (
					<section key={categoryName} className="category-section">
						<h3>{categoryName}</h3>
						<div className="product-grid">
							{productsInCategories.map((p, i) => (
								<ProductCard
									key={i}
									product={p}
									filteredProducts={filteredProducts}
									onButtonClick={handleProductAddClick}
									onCardClick={handleProductClick}
								/>
							))}
						</div>
					</section>
				))}
				<Dialog
					open={productOpen}
					onOpenChange={handleOpenChange}
				>
					<Outlet context={{ setOpen: setProductOpen, open: productOpen, product: selectedProduct }} />
				</Dialog>
				<hr />
				<div className="faq">
					<h3>Preguntas frecuentes</h3>
					<details onToggle={handleFAQToggle} name="faq">
						<summary>
							<h4>¿Cuánto tarda en llegar mi pedido?</h4>
							<ChevronDown />
						</summary>
						<p>
							El tiempo estimado de entrega suele ser de entre 30 y 45 minutos.
							Este plazo puede variar ligeramente dependiendo de la cantidad de
							comandas en cocina y de la distancia del repartidor hasta tu ubicación.
						</p>
					</details>
					<details onToggle={handleFAQToggle} name="faq">
						<summary>
							<h4>¿Puedo programar un pedido para más tarde?</h4>
							<ChevronDown />
						</summary>
						<p>
							¡Sí, claro! Al avanzar al proceso de pago, podrás seleccionar si deseas
							recibir tu comida lo antes posible o elegir una hora específica del día
							de hoy para que se entregue exactamente cuando lo necesites.
						</p>
					</details>
					<details onToggle={handleFAQToggle} name="faq">
						<summary>
							<h4>¿Cómo puedo aplicar un código de descuento?</h4>
							<ChevronDown />
						</summary>
						<p>
							Si tienes un cupón promocional, verás un campo de texto dedicado a ello
							en la pantalla de confirmación, justo antes de proceder al pago definitivo.
							El descuento se verá reflejado inmediatamente en el precio total.
						</p>
					</details>
					<details onToggle={handleFAQToggle} name="faq">
						<summary>
							<h4>¿Qué hago si tengo una alergia o intolerancia alimentaria?</h4>
							<ChevronDown />
						</summary>
						<p>
							Dentro de la ficha detallada de cada producto (al hacer click sobre la
							tarjeta del plato), encontrarás la lista completa de alérgenos declarados.
							Además, puedes dejarnos una nota con indicaciones especiales para la cocina
							antes de añadirlo al carrito.
						</p>
					</details>
					<details onToggle={handleFAQToggle} name="faq">
						<summary>
							<h4>¿Puedo cancelar o modificar mi pedido una vez confirmado?</h4>
							<ChevronDown />
						</summary>
						<p>
							Debido a que el restaurante comienza a preparar los alimentos de
							inmediato para asegurar la máxima calidad, las modificaciones o
							cancelaciones solo se permiten durante los primeros 2 minutos posteriores
							a la confirmación de la comanda.
						</p>
					</details>
				</div>
			</main>
			<Footer variant="light" />
		</>
	);
}
