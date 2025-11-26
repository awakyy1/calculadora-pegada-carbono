// This file contains the logic for calculating the carbon footprint based on user inputs.

export function calcularPegadaCarbono(kmCarro, refeicoesCarne) {
    const co2Semanal = (kmCarro * 0.2) + (refeicoesCarne * 2);
    const co2Anual = co2Semanal * 52; // 52 semanas no ano
    return {
        semanal: co2Semanal.toFixed(2),
        anual: co2Anual.toFixed(2)
    };
}