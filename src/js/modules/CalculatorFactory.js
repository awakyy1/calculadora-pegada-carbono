/**
 * Design Pattern: Factory + Strategy
 * Cria diferentes tipos de calculadoras de carbono
 */

// Strategy: Interface para diferentes métodos de cálculo
class CalculationStrategy {
    calculate(data) {
        throw new Error('Método calculate deve ser implementado');
    }
}

// Estratégia básica de cálculo
class BasicCalculationStrategy extends CalculationStrategy {
    calculate(data) {
        const { kmCarro, refeicoesCarne, energiaEletrica, transporte } = data;
        
        let co2Semanal = 0;
        co2Semanal += (kmCarro || 0) * 0.2;
        co2Semanal += (refeicoesCarne || 0) * 2.5;
        co2Semanal += (energiaEletrica || 0) * 0.5;
        co2Semanal += (transporte || 0) * 0.05;
        
        const co2Anual = co2Semanal * 52;
        
        return {
            semanal: co2Semanal.toFixed(2),
            anual: co2Anual.toFixed(2),
            method: 'basic'
        };
    }
}

// Estratégia avançada (considera fatores regionais)
class AdvancedCalculationStrategy extends CalculationStrategy {
    constructor(regionalFactor = 1.0) {
        super();
        this.regionalFactor = regionalFactor;
    }
    
    calculate(data) {
        const { kmCarro, refeicoesCarne, energiaEletrica, transporte } = data;
        
        let co2Semanal = 0;
        co2Semanal += (kmCarro || 0) * 0.2 * this.regionalFactor;
        co2Semanal += (refeicoesCarne || 0) * 2.5 * this.regionalFactor;
        co2Semanal += (energiaEletrica || 0) * 0.5 * this.regionalFactor;
        co2Semanal += (transporte || 0) * 0.05 * this.regionalFactor;
        
        const co2Anual = co2Semanal * 52;
        
        return {
            semanal: co2Semanal.toFixed(2),
            anual: co2Anual.toFixed(2),
            method: 'advanced',
            regionalFactor: this.regionalFactor
        };
    }
}

// Factory para criar calculadoras
class CalculatorFactory {
    static createCalculator(type = 'basic', options = {}) {
        switch(type) {
            case 'basic':
                return new BasicCalculationStrategy();
            case 'advanced':
                return new AdvancedCalculationStrategy(options.regionalFactor || 1.0);
            default:
                throw new Error(`Tipo de calculadora desconhecido: ${type}`);
        }
    }
}

export { CalculatorFactory, BasicCalculationStrategy, AdvancedCalculationStrategy };

