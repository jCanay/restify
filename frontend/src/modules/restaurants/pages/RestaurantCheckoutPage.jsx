import { ChevronDown, ChevronLeft } from "lucide-react";
import "../css/restaurant-checkout-page.css";
import { useNavigate, useParams } from "react-router";
import { useStore } from "@nanostores/react";
import {
    $cartStore,
    getCheckoutTotal,
    getItemTotalPrice,
    getTotalItems,
} from "../context/cartStore";
import { formatCurrency } from "../utils/stringParser";
import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import AddressMap from "../components/AddressMap/AddressMap";

export default function RestaurantCheckoutPage() {
    const navigate = useNavigate();
    const { shippingCosts, items } = useStore($cartStore) || 0;

    return (
        <main className="restaurant-checkout-page container">
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
                                <h3>
                                    Tu pedido
                                    <span>
                                        {getTotalItems()} producto
                                        {getTotalItems() !== 1 ? "s" : ""}
                                    </span>
                                </h3>
                                <ChevronDown />
                                <hr />
                            </summary>
                            <ul>
                                {items?.map((item, i) => (
                                    <li key={i}>
                                        <span className="item-count">
                                            {item?.quantity}x
                                        </span>
                                        {item?.name}
                                        <span className="price">
                                            {formatCurrency.format(item?.price)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                    <div className="delivery">
                        <h3>Dirección de entrega</h3>
                        <AddressMap address={"Pura e Dora Vázquez 25"} />
                    </div>
                    <div className="payment">
                        <h3>Método de pago</h3>
                    </div>
                </section>
                <aside>
                    <h3>Resumen</h3>
                    <hr />
                    <ul>
                        <li>
                            Productos
                            <span>
                                {formatCurrency.format(getItemTotalPrice())}
                            </span>
                        </li>
                        <li>
                            Gastos de envío
                            <span>{formatCurrency.format(shippingCosts)}</span>
                        </li>

                        <li className="total">
                            TOTAL
                            <span>
                                {formatCurrency.format(getCheckoutTotal())}
                            </span>
                        </li>
                    </ul>
                    <button type="button">Pagar</button>
                </aside>
            </div>
        </main>
    );
}
