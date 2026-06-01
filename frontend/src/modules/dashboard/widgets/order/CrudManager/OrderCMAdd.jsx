import { Spinner } from "@/components/ui/spinner";
import {
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { useOrders } from "@/modules/restaurants/hooks/useOrders";
import "./css/order-cm-add.css";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useEffect, useState } from "react";
import { useAddress } from "@/modules/restaurants/hooks/useAddress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/modules/restaurants/components/ProductCard/ProductCard";
import { useProducts } from "@/modules/restaurants/hooks/useProducts";
import { $cartStore } from "@/modules/restaurants/context/cartStore";
import { useRestaurants } from "@/modules/restaurants/hooks/useRestaurants";
import { formatCurrency } from "@/modules/restaurants/utils/stringParser";
import { CreditCard, HandCoins, Wallet } from "lucide-react";
import { SiApplepay, SiGooglepay, SiPaypal, SiReact } from '@icons-pack/react-simple-icons';

const DEFAULT_DATA = {
	items: [],
	address: {},
	restaurantId: "",
	accountId: "",
	payment: {
		amount: "",
		method: "",
	},
};

const PAYMENT_METHODS = {
	CASH: {
		name: "CASH",
		label: "Efectivo",
		icon: <HandCoins />
	},
	CREDIT_CARD: {
		name: "CREDIT_CARD",
		label: "Tarjeta de crédito",
		icon: <CreditCard />
	},
	PAYPAL: {
		name: "PAYPAL",
		label: "PayPal",
		icon: <SiPaypal />
	},
	GOOGLE_PAY: {
		name: "GOOGLE_PAY",
		label: "Google Pay",
		icon: <SiGooglepay />
	},
	APPLE_PAY: {
		name: "APPLE_PAY",
		label: "Apple Pay",
		icon: <SiApplepay />
	},
};

export default function OrderCMAdd({ open, setOpen = () => { } }) {
	const { addOrder, loading, error } = useOrders();
	const { getAllAddressByUser, loading: addressLoading, error: addressError } = useAddress();
	const { getProducts, loading: productsLoading, error: productsError } = useProducts();
	const { getRestaurant } = useRestaurants();
	const [addresses, setAddressess] = useState([]);
	const [selectedAddressId, setSelectedAddressId] = useState(-1);
	const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS.PAYPAL.name);
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [shippingCosts, setShippingCosts] = useState(-1);

	useEffect(() => {
		const loadAddresses = async () => {
			const response = await getAllAddressByUser();

			setAddressess(response);
			setSelectedAddressId(response[0].id);
		};

		const loadProducts = async () => {
			const response = await getProducts(getUserDefaultRestaurant()?.id);

			const initialProducts = response.map(p => ({ ...p, quantity: 0 }));

			setItems(initialProducts);
			console.log(initialProducts);
		};

		const loadRestaurant = async () => {
			const response = await getRestaurant(getUserDefaultRestaurant()?.id);

			setShippingCosts(response.shippingCosts);
		};

		loadAddresses();
		loadProducts();
		loadRestaurant();
	}, [getAllAddressByUser, getProducts, getRestaurant, open]);

	const parseItems = (items) => {
		return items.map((i) => ({
			name: i.name,
			price: i.price,
			quantity: i.quantity
		}));
	};

	const handleAddClick = async () => {
		const newOrder = await addOrder({
			order: {
				items: parseItems(selectedItems),
				notes: "Dejar en la puerta",
				payment: {
					amount: getTotal(selectedItems),
					status: "PAID",
					method: selectedPayment
				}
			},
			restaurantId: getUserDefaultRestaurant()?.id,
			addressId: selectedAddressId
		});

		// Close dialog if added successfully
		if (newOrder) setOpen(false);
	};

	const handleAddressSelect = (value) => {
		setSelectedAddressId(value);
	};

	const handlePaymentSelect = (value) => {
		setSelectedPayment(value);
	};

	const handleValueChange = (product, value) => {
		// 1. Actualizamos primero la lista visual de productos ('items')
		const updatedProducts = items.map((item) =>
			item.id === product.id ? { ...item, quantity: value } : item
		);
		setItems(updatedProducts);

		// 2. Gestionamos la lista de elementos seleccionados ('selectedItems')
		setSelectedItems((prevSelectedItems) => {
			// Comprobamos si el producto ya fue añadido previamente
			const exists = prevSelectedItems.find((item) => item.id === product.id);

			if (value <= 0) {
				// Condición C: Si la cantidad baja a 0, lo eliminamos de la lista
				return prevSelectedItems.filter((item) => item.id !== product.id);
			}

			if (exists) {
				// Condición B: Si ya existe, actualizamos su propiedad quantity
				return prevSelectedItems.map((item) =>
					item.id === product.id ? { ...item, quantity: value } : item
				);
			} else {
				// Condición A: Si no existe, lo añadimos como un nuevo elemento con su cantidad
				return [...prevSelectedItems, { ...product, quantity: value }];
			}
		});
	};

	const getItemCount = (items) => {
		let total = 0;

		items.forEach((item) => {
			total += item.quantity;
		});

		return total;
	};

	const getTotal = (items) => {
		let total = 0;

		items.forEach((item) => {
			total += item.price * item.quantity;
		});

		total += shippingCosts;

		return total;
	};

	return (
		<DialogContent
			onOpenAutoFocus={(e) => {
				e.preventDefault();
				e.currentTarget.focus();
			}}
			className="order-crud-manager add"
		>
			<DialogTitle>Añadir pedido</DialogTitle>
			<DialogDescription>
				Selecciona los productos, la dirección de entrega y el método de pago para continuar.
			</DialogDescription>
			<div
				className="wrapper"
				onMouseDown={(e) => e.stopPropagation()}
				onClick={(e) => e.stopPropagation()}
			>
				<section className="filter">
					<span>Dirección de entrega</span>
					{(!addressLoading && !addressError) ? (
						<Select defaultValue={addresses[0]?.id || -1} onValueChange={handleAddressSelect}>
							<SelectTrigger className="select text-ellipsis">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="select-filter" >
								<SelectGroup>
									{addresses.map((a, i) => (
										<SelectItem key={i} value={a.id}>{a.streetAddress}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					) : (
						<Skeleton className="w-full h-8 bg-neutral-200" />
					)}
				</section>
				<section className="filter">
					<span>Método de pago</span>
					{(!addressLoading && !addressError) ? (
						<Select defaultValue={PAYMENT_METHODS.PAYPAL.name} onValueChange={handlePaymentSelect}>
							<SelectTrigger className="select text-ellipsis">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="select-filter" >
								<SelectGroup>
									{Object.values(PAYMENT_METHODS).map((a, i) => (
										<SelectItem key={i} value={a.name}>
											<div className="flex gap-2 items-center">{a.icon}{a.label}</div>
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					) : (
						<Skeleton className="w-full h-8 bg-neutral-200" />
					)}
				</section>
				<section className="products">
					{items.map((item, i) => (
						<ProductCard size="compact" key={i} quantity={item.quantity} product={item} filteredProducts={items} onValueChange={handleValueChange} />
					))}
				</section>
				<section>
					{getItemCount(selectedItems)} productos
				</section>
				<section>
					TOTAL: {formatCurrency.format(getTotal(selectedItems))}
				</section>
			</div>
			<button
				onClick={handleAddClick}
				disabled={loading || selectedItems.length <= 0}
				className="btn"
				type="button"
			>
				<span>Añadir pedido</span>
				{loading && <Spinner data-icon="inline-start" />}
			</button>
		</DialogContent>
	);
}