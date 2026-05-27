import { ChevronLeft } from "lucide-react";
import "../css/restaurant-checkout-page.css";

export default function RestaurantCheckoutPage() {
    return (
        <main className="restaurant-checkout-page">
            <nav>
                <button>
                    <ChevronLeft size={32} />
                </button>
                <h2>Tu pedido</h2>
            </nav>
        </main>
    );
}
