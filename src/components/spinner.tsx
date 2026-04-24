
const Spinner = () => {
    return (
        <div className="spinner-container" >
            <svg
                width="30"
                height="30"
                viewBox="0 0 50 50"
                className="spinner-svg"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#1d9bf0" // El azul de X
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="90, 150"
                />
            </svg>

        </div>
    );
};

export default Spinner;