import React from 'react';

interface ProgressCircleProps {
    currentLength: number;
    maxLength: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ currentLength, maxLength }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius; // 62.83 aprox

    // Calculamos el porcentaje (máximo 100)
    const percentage = Math.min((currentLength / maxLength) * 100, 100);

    // El offset es lo que "esconde" el borde. 0 es lleno, circunferencia es vacío.
    const offset = circumference - (percentage / 100) * circumference;

    // Cambiar color si se acerca al límite
    const getColor = () => {
        if (currentLength >= maxLength) return '#f4212e'; // Rojo
        if (currentLength >= maxLength - 20) return '#ffd400'; // Amarillo
        return '#1d9bf0'; // Azul X
    };

    return (
        <svg width="30" height="30" viewBox="0 0 30 30">
            {/* Círculo de fondo (gris tenue) */}
            <circle
                cx="15"
                cy="15"
                r={radius}
                fill="none"
                stroke="#333"
                strokeWidth="2"
            />
            {/* Círculo de progreso */}
            <circle
                cx="15"
                cy="15"
                r={radius}
                fill="none"
                stroke={getColor()}
                strokeWidth="2"
                strokeDasharray={circumference}
                style={{
                    strokeDashoffset: offset,
                    transition: 'stroke-dashoffset 0.1s ease',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                }}
            />
        </svg>
    );
};