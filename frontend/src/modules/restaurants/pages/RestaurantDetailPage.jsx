import "../css/restaurant-detail-page.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import RestaurantsNavbar from "../components/RestaurantsNavbar/RestaurantsNavbar";
import { RESTAURANT_IMAGES } from "../components/RestaurantCard/RestaurantCard";
import { ChevronDown, Plus } from "lucide-react";
import { Breadcrums } from "../components/Breadcrums/Breadcrums";

export default function RestaurantDetailPage() {
    const { getProductsByUrl, loading, error } = useProducts();
    const { countryCode, city, slug } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [restaurant, setRestaurant] = useState({});

    const img = RESTAURANT_IMAGES[restaurant.id % RESTAURANT_IMAGES.length];

    const PRODUCT_IMAGES_MOCK = [
        "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=500&q=80", // Bacon Cheese Fries
        "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1380&auto=format&fit=crop", // BBQ Chicken Wings
        "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=987&auto=format&fit=crop", // Onion Rings
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", // Classic Cheeseburger
        "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=500&q=80", // Smoky Bacon Burger
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80", // Trifásica Burger
        "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=500&q=80", // Veggie Crunch
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80", // Chocolate Brownie
        "https://images.unsplash.com/photo-1609501967126-1a43c02f655c?q=80&w=987&auto=format&fit=crop", // New York Cheesecake
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80", // Coca-Cola Original
    ];

    useEffect(() => {
        const loadProducts = async () => {
            if (!countryCode || !city || !slug) {
                return;
            }

            const response = await getProductsByUrl({
                countryCode,
                city,
                slug,
            });

            setRestaurant(response.restaurant);
            setProducts(response.products);
            setFilteredProducts(response.products);
        };

        loadProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !countryCode || !city || !slug) {
        return <div>Not found</div>;
    }

    const formatCurrency = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    });

    const handleProductClick = () => {};

    const handleFAQToggle = (e) => {
        if (e.target.open) {
            setTimeout(() => {
                e.target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 50);
        }
    };

    const links = [
        {
            label: restaurant?.address?.city,
            url: `/${countryCode}/${city}`,
        },
        {
            label: restaurant?.name,
        },
    ];

    return (
        <>
            <RestaurantsNavbar placeholder={`Buscar en ${restaurant.name}`} />
            <main className="restaurant-detail-page container">
                <Breadcrums links={links} />
                <header>
                    <img src={img} alt="" draggable="false" />
                    <h2>{restaurant.name}</h2>
                </header>
                {Object.entries(
                    filteredProducts.reduce((acc, product) => {
                        const cat = product.category || "Otros";
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(product);
                        return acc;
                    }, {}),
                ).map(([categoryName, productsInCategories]) => (
                    <section key={categoryName} className="category-section">
                        <h3>{categoryName}</h3>
                        <div className="product-grid">
                            {productsInCategories.map((p, i) => (
                                <article
                                    key={i}
                                    className="product-card"
                                    onClick={handleProductClick}
                                >
                                    <div className="content">
                                        <header>
                                            <h4>{p.name}</h4>
                                            <span>
                                                {formatCurrency.format(p.price)}
                                            </span>
                                        </header>
                                        <p>{p.description}</p>
                                    </div>
                                    <img
                                        src={
                                            PRODUCT_IMAGES_MOCK[
                                                filteredProducts.indexOf(p) %
                                                    PRODUCT_IMAGES_MOCK.length
                                            ]
                                        }
                                        alt={p.name}
                                        draggable="false"
                                    />
                                    <button>
                                        <Plus size={24} strokeWidth={2.25} />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
                <hr />
                <div className="faq">
                    <h3>Preguntas frecuentes</h3>
                    <details onToggle={handleFAQToggle} name="faq">
                        <summary>
                            <h4>Puedo hacer un pedido con entrega</h4>
                            <ChevronDown />
                        </summary>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Doloribus ab vero voluptatum odit deserunt
                            saepe sint minima laudantium. Quis, soluta neque
                            eveniet fuga ipsum officia aliquid obcaecati
                            voluptate excepturi illo!
                        </p>
                    </details>
                    <details onToggle={handleFAQToggle} name="faq">
                        <summary>
                            <h4>Puedo hacer un pedido con entrega</h4>
                            <ChevronDown />
                        </summary>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Doloribus ab vero voluptatum odit deserunt
                            saepe sint minima laudantium. Quis, soluta neque
                            eveniet fuga ipsum officia aliquid obcaecati
                            voluptate excepturi illo!
                        </p>
                    </details>
                    <details onToggle={handleFAQToggle} name="faq">
                        <summary>
                            <h4>Puedo hacer un pedido con entrega</h4>
                            <ChevronDown />
                        </summary>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Doloribus ab vero voluptatum odit deserunt
                            saepe sint minima laudantium. Quis, soluta neque
                            eveniet fuga ipsum officia aliquid obcaecati
                            voluptate excepturi illo!
                        </p>
                    </details>
                    <details onToggle={handleFAQToggle} name="faq">
                        <summary>
                            <h4>Puedo hacer un pedido con entrega</h4>
                            <ChevronDown />
                        </summary>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Doloribus ab vero voluptatum odit deserunt
                            saepe sint minima laudantium. Quis, soluta neque
                            eveniet fuga ipsum officia aliquid obcaecati
                            voluptate excepturi illo!
                        </p>
                    </details>
                </div>
            </main>
        </>
    );
}
