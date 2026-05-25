import { Plus } from "lucide-react";
import { addItemToCart, getItemCountById, updateItemQuantity } from "../../context/cartStore";
import { PRODUCT_IMAGES_MOCK } from "../../utils/constants";
import { formatCurrency } from "../../utils/stringParser";
import Stepper from "../Stepper/Stepper";
import "./css/product-card.css";

export default function ProductCard({ product = {}, filteredProducts = [], onCardClick, onButtonClick }) {

	const handleValueChange = (product, value) => {
		if (value == 1) {
			addItemToCart(product);
		}
		updateItemQuantity(product.id, value);
	};

	return (
		<article
			className="product-card"
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
					]
				}
				alt={product.name}
				draggable="false"
			/>
			{/* <button onClick={(e) => onButtonClick(e, product)}>
				<Plus size={24} strokeWidth={2.25} />
			</button> */}
			<Stepper
				value={getItemCountById(product.id)}
				minValue={0}
				showDeleteButton
				showValueOnMin={false}
				onValueChange={(value) => handleValueChange(product, value)}
			/>
		</article>
	);
}