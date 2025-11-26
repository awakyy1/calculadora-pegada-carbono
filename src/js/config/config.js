/**
 * Design Pattern: Singleton
 * Gerencia configurações da aplicação de forma centralizada
 */
class ConfigManager {
    static instance = null;
    
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        
        this.config = {
            apiEndpoint: window.location.origin + '/api',
            defaultEmissionFactors: {
                carPerKm: 0.2, // kg CO2 por km
                meatPerMeal: 2.5, // kg CO2 por refeição
                electricityPerKwh: 0.5, // kg CO2 por kWh
                publicTransportPerKm: 0.05 // kg CO2 por km
            },
            apiKeys: {
                openweather: null // será configurado no backend
            }
        };
        
        ConfigManager.instance = this;
    }
    
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    
    get(key) {
        return this.config[key];
    }
    
    set(key, value) {
        this.config[key] = value;
    }
    
    getEmissionFactor(type) {
        return this.config.defaultEmissionFactors[type] || 0;
    }
}

export default ConfigManager;

