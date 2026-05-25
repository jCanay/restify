import { useProducts } from "@/modules/restaurants/hooks/useProducts";
import "./css/products-page.css";
import { useEffect, useState } from "react";
import { getUserDefaultRestaurant } from "../../contexts/userStore";
import { uniq } from "lodash";
import { ChevronRight, Edit } from "lucide-react";
import ProductCard from "@/modules/restaurants/components/ProductCard/ProductCard";
import { PRODUCT_IMAGES_MOCK } from "@/modules/restaurants/utils/constants";
import { formatCurrency } from "@/modules/restaurants/utils/stringParser";

export default function ProductsPage() {
	const { getProducts, loading, error } = useProducts();
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [currentCategory, setCurrentCategory] = useState("");

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const response = await getProducts(getUserDefaultRestaurant()?.id);
				const categoriesResponse = uniq(response.map((p => p.category)));

				setProducts(response);
				setFilteredProducts(response.filter(p => p.category === categoriesResponse[0]));
				setCategories(categoriesResponse);
				setCurrentCategory(categoriesResponse[0]);
			} catch (err) {
				console.error(err);
			}
		};

		loadProducts();
	}, [getProducts]);

	const getProductCountByCategory = (category) => {
		return products.filter((p) => p.category === category).length;
	};

	const handleCategoryClick = (category) => {
		setCurrentCategory(category);
		setFilteredProducts(products.filter((p) => p.category === category));
	};

	const handleSearchChange = (e) => {
		const filtered = products.filter(p =>
			p.name
				.toLowerCase()
				.replace(" ", "")
				.includes(e.target.value.toLowerCase().replace(" ", "")));
		setFilteredProducts(filtered);

		setCurrentCategory(filtered[0].category);
	};

	return (
		<div className="products-page">
			<div className="search-bar">
				<input
					type="search"
					name=""
					id=""
					placeholder="Introduce el nombre del producto"
					onChange={handleSearchChange}
				/>
			</div>
			<main>
				<aside>
					<ul>
						{categories.map((category, i) => (
							<li key={i} className={`${currentCategory === category ? "active" : ""}`} onClick={() => handleCategoryClick(category)}>
								<div>
									<h4>{category}</h4>
									<span>{getProductCountByCategory(category)} productos</span>
								</div>
								<ChevronRight strokeWidth={1.5} />
							</li>
						))}
					</ul>
				</aside>
				<section>
					<header>
						<h3>{currentCategory}</h3>
						<button>
							<Edit />
						</button>
					</header>
					<ul>
						{filteredProducts.map((p, i) => (
							<li key={i}>
								<img src={PRODUCT_IMAGES_MOCK[
									products.indexOf(p) %
									PRODUCT_IMAGES_MOCK.length
								]} alt="" />
								<div className="content">
									<h4>{p.name}</h4>
									<span>{formatCurrency.format(p.price)}</span>
								</div>
							</li>
						))}
					</ul>
				</section>
			</main>
		</div>
	);
}