import { DateInput, DatesProvider } from "@mantine/dates";
import { ActionIcon, MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import "dayjs/locale/es";
import { addDays, addMonths } from "date-fns";
import "./css/input-date-picker.css";

export default function InputDatePicker({
    label,
    description,
    placeholder,
    required,
    disabled = false,
    clearable = false,
    readOnly = false,
    defaultValue,
    onDateChange = () => {},
}) {
    const [dropdownOpened, setDropdownOpened] = useState(false);
    const [date, setDate] = useState(defaultValue || undefined);

    useEffect(() => {
        onDateChange(date);
    }, []);

    return (
        <MantineProvider>
            <DatesProvider settings={{ locale: "es" }}>
                <DateInput
                    className="input-date-picker"
                    locale="es"
                    label={label}
                    description={description}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    minDate={new Date()}
                    maxDate={addMonths(new Date(), 3)}
                    clearable={clearable}
                    highlightToday
                    maxLevel="year"
                    rightSection={
                        <ActionIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpened(!dropdownOpened);
                            }}
                            onBlur={() => setDropdownOpened(false)}
                            variant="default"
                        >
                            <Calendar size={18} />
                        </ActionIcon>
                    }
                    popoverProps={{
                        trapFocus: false,
                        withinPortal: false,
                        opened: dropdownOpened,
                    }}
                    value={date}
                    valueFormat="LL"
                    onClick={() => setDropdownOpened(!dropdownOpened)}
                    onBlur={() => setDropdownOpened(false)}
                    onChange={(value) => {
                        setDate(new Date(value));
                        onDateChange(new Date(value));

                        setDropdownOpened(false);

                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                    }}
                />
            </DatesProvider>
        </MantineProvider>
    );
}
