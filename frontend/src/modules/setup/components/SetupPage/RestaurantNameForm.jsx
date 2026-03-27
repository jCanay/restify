import LocationPicker from "../LocationPicker/LocationPicker";
import MapboxPicker from "../LocationPicker/MapboxPicker";
import "./css/restaurant-name-form.css";

function RestaurantNameForm() {
    const handleLocationChange = () => {};

    return (
        <div className="restaurant-name-form">
            <h2 className="text-3xl font-semibold">Configura tu restaurante</h2>
            <p>
                Introduce los datos de tu restaurante. Podrás crear restaurantes
                adicionales más tarde.
            </p>
            <form>
                <label htmlFor="restaurantName">Nombre del restaurante</label>
                <input type="text" name="restaurantName" id="restaurantName" />
                {/* <input
                                type="text"
                                name="restaurantStreet"
                                id="restaurantStreet"
                                placeholder="Calle"
                            />
                            <input
                                type="text"
                                name="restaurantCity"
                                id="restaurantCity"
                                placeholder="Ciudad"
                            />
                            <input
                                type="number"
                                pattern="\d*"
                                name="restaurantStreetNumber"
                                id="restaurantStreetNumber"
                                placeholder="Número"
                            /> */}
            </form>
            {/* <LocationPicker onLocationChange={handleLocationChange} /> */}
            {/* <MapboxPicker /> */}
        </div>
    );
}

export default RestaurantNameForm;
