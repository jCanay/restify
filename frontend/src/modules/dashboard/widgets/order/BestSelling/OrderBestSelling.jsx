import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Widget from "../../general/Widget";
import "./css/order-best-selling.css";
import { formatCurrency } from "@/modules/restaurants/utils/stringParser";
import { PRODUCT_IMAGES_MOCK } from "@/modules/restaurants/utils/constants";
import { useProducts } from "@/modules/restaurants/hooks/useProducts";
import { useEffect, useState } from "react";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";

export default function OrderBestSelling() {
	const { getProducts, loading, error } = useProducts();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const loadProducts = async () => {
			const response = await getProducts(getUserDefaultRestaurant()?.id);

			console.log(response);

			setProducts(response);
		};

		loadProducts();
	}, [getProducts]);

	return (
		<Widget className="order-best-selling" title="Productos más vendidos">
			<Select defaultValue="all">
				<SelectTrigger className="select text-ellipsis">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="select-filter" >
					<SelectGroup>
						<SelectItem value="all">Desde el principio</SelectItem>
						<SelectItem value="year">Este año</SelectItem>
						<SelectItem value="month6">Últimos 6 meses</SelectItem>
						<SelectItem value="month3">Últimos 3 meses</SelectItem>
						<SelectItem value="month">Este mes</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<ul>
				{products.map((product, i) => (
					<article key={i}>
						<div className="content">
							<header>
								<h4>{product.name}</h4>
								<span>
									{formatCurrency.format(product.price)}
								</span>
							</header>
						</div>
						<img
							src={
								PRODUCT_IMAGES_MOCK[
								products.indexOf(product) %
								PRODUCT_IMAGES_MOCK.length
								]
							}
							alt={product.name}
							draggable="false"
						/>
					</article>
				))}
			</ul>
		</Widget>
	);
}