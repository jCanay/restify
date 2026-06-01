import { ChevronDown, ChevronLeft, CreditCard, HandCoins, MapPin } from "lucide-react";
import "../css/restaurant-checkout-page.css";
import { useNavigate, useParams } from "react-router";
import { useStore } from "@nanostores/react";
import { $cartStore, deleteCartKey, getCheckoutTotal, getItemTotalPrice, getTotalItems } from "../context/cartStore";
import { formatCurrency } from "../utils/stringParser";
import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import AddressMap from "../components/AddressMap/AddressMap";
import { SiApplepay, SiGooglepay, SiPaypal } from "@icons-pack/react-simple-icons";
import { useAddress } from "../hooks/useAddress";
import { Spinner } from "@/components/ui/spinner";
import { useOrders } from "../hooks/useOrders";
import { Toaster } from "@/components/ui/sonner";
import { showToast } from "@/modules/dashboard/components/NotificationToast";

const PAYMENT_METHODS = {
	CASH: {
		name: "CASH",
		label: "Efectivo",
		icon: <HandCoins size={20} className="payment-icon" />
	},
	CREDIT_CARD: {
		name: "CREDIT_CARD",
		label: "Tarjeta de crédito",
		icon: <CreditCard size={20} className="payment-icon" />
	},
	PAYPAL: {
		name: "PAYPAL",
		label: "PayPal",
		icon: <SiPaypal size={20} className="payment-icon" />
	},
	GOOGLE_PAY: {
		name: "GOOGLE_PAY",
		label: "Google Pay",
		icon: <SiGooglepay size={20} className="payment-icon" />
	},
	APPLE_PAY: {
		name: "APPLE_PAY",
		label: "Apple Pay",
		icon: <SiApplepay size={20} className="payment-icon" />
	},
};

export default function RestaurantCheckoutPage() {
	const navigate = useNavigate();
	const { shippingCosts, restaurantId, items } = useStore($cartStore) || 0;
	const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS.CASH.name);
	const [selectedAddressId, setSelectedAddressId] = useState(-1);
	const [addresses, setAddresses] = useState([]);
	const { getAllAddressByUser } = useAddress();
	const { addOrder, loading, error } = useOrders();
	const [payDisabled, setPayDisabled] = useState(false);

	useEffect(() => {
		const loadAddresses = async () => {
			try {
				const response = await getAllAddressByUser();

				setAddresses(response);
				setSelectedAddressId(response[0].id);

				console.log(response);

			} catch (err) {
				console.error(err);
			}
		};

		loadAddresses();
	}, [getAllAddressByUser]);

	const handlePaymentSelect = (e) => {
		setSelectedPayment(e.target.value);
	};

	const handleAddressSelect = (e) => {
		setSelectedAddressId(e.target.value);
	};

	const parseItems = (items) => {
		return items.map((i) => ({
			name: i.name,
			price: i.price,
			quantity: i.quantity
		}));
	};

	const handlePayClick = async () => {
		const newOrder = await addOrder({
			order: {
				items: parseItems(items),
				notes: "Dejar en la puerta",
				payment: {
					amount: getCheckoutTotal(),
					status: "PAID",
					method: selectedPayment
				}
			},
			restaurantId: restaurantId,
			addressId: selectedAddressId
		});

		if (!newOrder) return;

		// Post successful payment actions
		setPayDisabled(true);

		showToast({
			dismissible: false,
			title: "Pedido creado",
			description: "No cierres la ventana, estamos confirmando tu pedido...",
			variant: "success"
		});

		await new Promise((r) => setTimeout(r, 4000));

		deleteCartKey();
		navigate(-1);
	};

	return (
		<main className="restaurant-checkout-page container">
			<Toaster position="top-center" />
			<nav>
				<button onClick={() => navigate(-1)}>
					<ChevronLeft size={32} />
				</button>
				<h2>Checkout</h2>
			</nav>
			<div className="body">
				<section>
					<div className="products">
						<details>
							<summary>
								<h3>Tu pedido<span>
									{getTotalItems()} producto
									{getTotalItems() !== 1 ? "s" : ""}
								</span></h3>
								<ChevronDown />
								<hr />
							</summary>
							<ul>
								{items?.map((item, i) => (
									<li key={i}>
										<span className="item-count">{item?.quantity}x</span>
										{item?.name}
										<span className="price">{formatCurrency.format(item?.price)}</span>
									</li>
								))}
							</ul>
						</details>
					</div>
					<div className="delivery">
						<h3>Dirección de entrega</h3>
						<AddressMap
							latitude={addresses?.find((a) => a.id == selectedAddressId)?.latitude}
							longitude={addresses?.find((a) => a.id == selectedAddressId)?.longitude}
						/>
						<div className="payment">
							<details>
								<summary>
									<span className="flex gap-2 items-center">
										<MapPin size={20} className="payment-icon" />
										{addresses?.find((a) => a.id == selectedAddressId)?.streetAddress}
									</span>
									<ChevronDown />
									<hr />
								</summary>
								<ul>
									{addresses.map((address, i) => (
										<label key={i}>
											{address.streetAddress}
											<span className="price">
												<input
													type="radio"
													name="address"
													checked={selectedAddressId == address.id}
													value={address.id}
													onChange={handleAddressSelect}
													id={address.name}
												/>
											</span>
										</label>
									))}
								</ul>
							</details>
						</div>
					</div>

					<div className="payment">
						<details>
							<summary>
								<h3>Método de pago
									<span className="flex gap-2 items-center">
										{PAYMENT_METHODS[selectedPayment].icon}
										{PAYMENT_METHODS[selectedPayment].label}
									</span>
								</h3>
								<ChevronDown />
								<hr />
							</summary>
							<ul>
								{Object.values(PAYMENT_METHODS)?.map((method, i) => (
									<label key={i}>
										{method.icon}
										{method.label}
										<span className="price">
											<input
												type="radio"
												name="payment"
												checked={selectedPayment == method.name}
												value={method.name}
												onChange={handlePaymentSelect}
												id={method.name}
											/>
										</span>
									</label>
								))}
							</ul>
						</details>
					</div>
				</section>
				<aside>
					<h3>Resumen</h3>
					<hr />
					<ul>
						<li>Productos<span>{formatCurrency.format(getItemTotalPrice())}</span></li>
						<li>Gastos de envío<span>{formatCurrency.format(shippingCosts)}</span></li>
						<li className="total">TOTAL<span>{formatCurrency.format(getCheckoutTotal())}</span></li>
					</ul>
					<button
						onClick={handlePayClick}
						disabled={loading || payDisabled}
						className="btn"
						type="button"
					>
						<span>Pagar</span>
						{loading && <Spinner className="spinner-svg" data-icon="inline-start" />}
					</button>
				</aside>
			</div>
		</main>
	);
}
