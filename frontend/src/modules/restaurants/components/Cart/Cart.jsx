import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./css/cart.css";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useStore } from "@nanostores/react";
import {
	$cartStore,
	getItemTotalPrice,
	getTotalItems,
	updateItemQuantity,
} from "../../context/cartStore";
import { PRODUCT_IMAGES_MOCK } from "../../utils/constants";
import { formatCurrency } from "../../utils/stringParser";
import Stepper from "../Stepper/Stepper";
import { getAuthStatus } from "@/modules/auth/utils/authUtils";
import { $authStore } from "@/modules/auth/contexts/authStore";
import { $userStore } from "@/modules/dashboard/contexts/userStore";
import { useNavigate } from "react-router";

export default function Cart() {
	const cart = useStore($cartStore);
	const items = cart.items || [];
	const { token } = useStore($authStore) || "";
	const { user, account } = useStore($userStore) || {};
	const { authenticated } = getAuthStatus(token, user, account);
	const navigate = useNavigate();
	const itemCount = getTotalItems();

	const handlePayClick = () => {
		if (!authenticated) {
			navigate("/login");
		} else {
			navigate("checkout");
		}
	};

	return (
		<div className="cart">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="cart-btn relative">
						{!!itemCount && <span>{itemCount}</span>}
						<ShoppingCart strokeWidth={2.5} size={20} />
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					onCloseAutoFocus={(e) => e.preventDefault()}
					className="cart-content"
					side="bottom"
					align="end"
					sideOffset={16}
				>
					<div className="title">
						<h3>Carrito</h3>
						{itemCount > 0 && (
							<span>
								{getTotalItems()} producto
								{getTotalItems() !== 1 ? "s" : ""}
							</span>
						)}
					</div>
					{itemCount <= 0 ? (
						<div className="empty">
							<ShoppingBag size={42} strokeWidth={1.75} />
							<h4>El carrito está vacío</h4>
							<p>Todavía no has añadido productos al carrito</p>
						</div>
					) : (
						<div className="items">
							{items.map((item, index) => (
								<article key={item.id || index}>
									<img
										src={
											PRODUCT_IMAGES_MOCK[
											(item?.id - 1) %
											PRODUCT_IMAGES_MOCK.length
											]
										}
										alt={item.name}
									/>
									<div className="details">
										<h5>{item.name}</h5>
										<span>
											{formatCurrency.format(item.price)}
										</span>
									</div>
									<Stepper
										className="stepper"
										minValue={0}
										value={item.quantity}
										showDeleteButton
										onValueChange={(newValue) =>
											updateItemQuantity(item.id, newValue)
										}
									/>
								</article>
							))}
						</div>
					)}
					<button disabled={itemCount === 0} className="pay-btn" onClick={handlePayClick}>
						Pagar {"("}
						{formatCurrency.format(getItemTotalPrice())}
						{")"}
					</button>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
