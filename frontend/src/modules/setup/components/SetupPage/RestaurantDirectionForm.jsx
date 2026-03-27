import { ChevronLeft } from "lucide-react";
import "./css/restaurant-direction-form.css";

function RestaurantDirectionForm({ onBackClick }) {
    return (
        <div className="restaurant-direction-form">
            <h2 className="text-2xl font-semibold">
                <button type="button" onClick={onBackClick}>
                    <ChevronLeft />
                </button>
                Dirección
            </h2>
            <p>Introduce los datos de la dirección física del restaurante.</p>
            <form>
                <div>
                    <label htmlFor="street">Dirección de la calle</label>
                    <input type="text" name="street" id="street" />
                </div>
                <div>
                    <label htmlFor="city">Ciudad</label>
                    <input type="text" name="city" id="city" />
                </div>
                <div>
                    <label htmlFor="country">País</label>
                    <input
                        type="text"
                        pattern="\d*"
                        name="country"
                        id="country"
                    />
                </div>
                <div>
                    <label htmlFor="postalCode">Código postal</label>
                    <input
                        type="number"
                        pattern="\d*"
                        name="postalCode"
                        id="postalCode"
                    />
                </div>
            </form>
        </div>
    );
}

export default RestaurantDirectionForm;
