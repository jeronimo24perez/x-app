

interface DatePickerProps {
    month: string,
    year: string,
    day: string,
    onChange: (field: "month" | "day" | "year", value: string) => void;
}
const months : string[]= [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const DatePicker = ({month, year, day, onChange}: DatePickerProps)=>{
    const currentYear = new Date().getFullYear();


    return <div>
        <h4>Fecha de nacimiento</h4>
        <p>
            Esta información no será pública. Confirma tu propia edad,
            incluso si esta cuenta es para una empresa, una mascota u otra cosa.
        </p>

        <div className="date-picker">
            {/* Mes */}
            <select value={month} onChange={(e) => onChange("month", e.target.value) }>
                <option value="">Mes</option>
                {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                        {m}
                    </option>
                ))}
            </select>

            {/* Día */}
            <select value={day} onChange={(e) => onChange("day",e.target.value)}>
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                        {d}
                    </option>
                ))}
            </select>

            {/* Año */}
            <select value={year} onChange={(e) => onChange("year", e.target.value)}>
                <option value="">Año</option>
                {Array.from({ length: 100 }, (_, i) => currentYear - i).map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
        </div>
    </div>
}

export default DatePicker;