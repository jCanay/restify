import "../css/setup-page.css";
import darkBg from "../assets/dark-bg.png";
import { ArrowRight } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Logo from "../../core/components/Logo";
import RestaurantNameForm from "../components/SetupPage/RestaurantNameForm";
import RestaurantDirectionForm from "../components/SetupPage/RestaurantDirectionForm";
import { useEffect, useState } from "react";
import RestaurantRadiusForm from "../components/SetupPage/RestaurantRadiusForm";

function SetupPage() {
    const [index, setIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    const handleBack = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    const steps = [
        <RestaurantNameForm />,
        <RestaurantDirectionForm onBackClick={handleBack} />,
        <RestaurantRadiusForm onBackClick={handleBack} />,
    ];

    const handleContinue = () => {
        if (index < steps.length - 1) {
            setIndex(index + 1);
            setHasStarted(true);
        }
    };

    return (
        <main className="setup-page">
            <div className="content">
                <aside>
                    <img src={darkBg} alt="" />
                </aside>
                <div className="setup-container">
                    <div
                        key={index}
                        className={
                            hasStarted
                                ? "step-wrapper animate-fade"
                                : "step-wrapper"
                        }
                    >
                        {steps[index]}
                        <button
                            className="continue"
                            onClick={handleContinue}
                            type="button"
                        >
                            <p>
                                Continuar
                                <ArrowRight size={14} />
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SetupPage;
