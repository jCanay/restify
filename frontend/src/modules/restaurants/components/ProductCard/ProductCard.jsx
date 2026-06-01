import { Plus } from "lucide-react";
import { addItemToCart, getItemCountById, updateItemQuantity } from "../../context/cartStore";
import { PRODUCT_IMAGES_MOCK } from "../../utils/constants";
import { formatCurrency } from "../../utils/stringParser";
import Stepper from "../Stepper/Stepper";
import "./css/product-card.css";
/**
 * 
 * @param {object} props
 * @param {object} [props.product]
 * @param {object} [props.filteredProducts]
 * @param {Number} [props.quantity]
 * @param {"compact" | "normal"} [props.size]
 * @param {Function} [props.onCardClick]
 * @param {Function} [props.onValueChange]
 */
export default function ProductCard({
	product = {},
	filteredProducts = [],
	quantity,
	size = "normal",
	onCardClick = () => { },
	onValueChange = () => { }
}) {

	const handleValueChange = (product, value) => {
		onValueChange(product, value);
	};

	return (
		<article
			className={`product-card ${size === "compact" ? "compact" : ""}`}
			onClick={() => onCardClick(product)}
		>
			<div className="content">
				<header>
					<h4>{product.name}</h4>
					<span>
						{formatCurrency.format(product.price)}
					</span>
				</header>
				<p>{product.description}</p>
			</div>
			<img
				src={
					PRODUCT_IMAGES_MOCK[
					filteredProducts.indexOf(product) %
					PRODUCT_IMAGES_MOCK.length
					] || PRODUCT_IMAGES_MOCK[0]
				}
				alt={product.name}
				draggable="false"
			/>
			<Stepper
				value={quantity}
				minValue={0}
				showDeleteButton
				showValueOnMin={false}
				onValueChange={(value) => handleValueChange(product, value)}
			/>
		</article>
	);
}