import "./css/restaurant-product.css";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router";
import { formatCurrency } from "../../utils/stringParser";
import { Minus, Plus, X } from "lucide-react";
import { PRODUCT_IMAGES_MOCK } from "../../utils/constants";
import { addItemToCart } from "../../context/cartStore";
import Stepper from "../Stepper/Stepper";

export default function RestaurantProduct() {
	const { countryCode, city, slug, productName } = useParams();
	const { open, setOpen, product } = useOutletContext();
	const [img, setImg] = useState("");
	const [quantity, setQuantity] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		const loadProduct = () => {
			setImg(PRODUCT_IMAGES_MOCK[(product?.id - 1) % PRODUCT_IMAGES_MOCK.length] || PRODUCT_IMAGES_MOCK[0]);
		};

		loadProduct();
	}, [product]);

	const handleAddToCart = () => {
		setOpen(false);
		console.log(product);

		addItemToCart({ ...product, quantity });
		navigate(`/${countryCode}/${city}/${slug}`);
	};

	return (
		<DialogContent showCloseButton={false} className="restaurant-product">
			<DialogClose className="close" onClick={() => setOpen(false)}>
				<X size={24} />
			</DialogClose>
			<img src={img} alt="" />
			<div className="content">
				<DialogTitle>{product?.name}</DialogTitle>
				<span className="price">{formatCurrency.format(product?.price)}</span>
				<DialogDescription>{product?.description}</DialogDescription>
				<section>
					<Stepper onValueChange={setQuantity} value={quantity} />
					<button className="add-to-cart" onClick={handleAddToCart}>
						Añadir {quantity} por {formatCurrency.format(product?.price * quantity)}
					</button>
				</section>
			</div>
		</DialogContent>
	);
}