import "../css/homepage.css";
import Navbar from "../components/Navbar";
import foodImg from "../assets/food-bg.jpg";
import driverImg from "../assets/driver.svg";
import searchImg from "../assets/search.svg";
import SearchBar from "../components/SearchBar";

function Homepage() {
    return (
        <>
            <Navbar />
            <main className="homepage">
                <header>
                    <div className="title">
                        <h2>
                            ¿Donde te llevamos la <span>comida</span>?
                        </h2>
                    </div>
                    <div className="search">
                        <SearchBar></SearchBar>
                    </div>
                    <section className="wave"></section>
                    {/* <svg width="1440" height="482" viewBox="0 0 1440 482" xmlns="http://www.w3.org/2000/svg">
						<path d="M1440 482L1360 472.037C1280 462.343 1120 442.417 960 411.45C800 380.484 640 338.477 480 336.054C320 333.899 160 371.598 80 390.447L0 409.296L3.57818e-05 -3.81849e-06L80 3.17534e-06C160 1.01692e-05 320 2.41568e-05 480 3.81444e-05C640 5.21321e-05 800 6.61197e-05 960 8.01074e-05C1120 9.4095e-05 1280 0.000108083 1360 0.000115076L1440 0.00012207L1440 482Z"/>
					</svg> */}
                    <img className="food-bg" src={foodImg} alt="" />
                </header>
                <section className="section1">
                    <section className="wave1"></section>
                    <section className="bg-color"></section>
                    <img src={driverImg} alt="" />
                    <div>
                        <h2>Pide también a Domicilio</h2>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Homepage;
