/**
 * Aplicação Principal - Calculadora de Pegada de Carbono
 * Implementa Design Patterns e integração com APIs
 */

import ConfigManager from './config/config.js';
import Observer from './modules/Observer.js';
import { CalculatorFactory } from './modules/CalculatorFactory.js';
import ApiService from './api/ApiService.js';
import { UIManager } from './ui.js';

class CarbonCalculatorApp {
    constructor() {
        // Singleton: ConfigManager
        this.config = ConfigManager.getInstance();
        
        // Observer: Sistema de eventos
        this.eventBus = new Observer();
        
        // API Service
        this.api = new ApiService(this.config.get('apiEndpoint'));
        
        // UI Manager
        this.ui = new UIManager(this.eventBus);
        
        // Estado da aplicação
        this.state = {
            userData: {},
            location: null,
            weather: null,
            calculationType: 'basic'
        };
        
        this.init();
    }
    
    async init() {
        console.log('🌍 Inicializando Calculadora de Pegada de Carbono...');
        
        // 1. Inicializar UI primeiro (para registrar observers)
        this.ui.init();
        
        // 2. Registrar eventos da aplicação
        this.setupEventListeners();
        
        // 3. Carregar dados de localização (depois que UI está pronta)
        await this.loadLocationData();
        
        // 4. Carregar estatísticas
        await this.loadStats();
        
        console.log('✅ Aplicação inicializada com sucesso!');
    }
    
    async loadStats() {
        try {
            const response = await this.api.get('/stats');
            if (response && response.success) {
                this.updateCounter(response.data.totalCalculations);
            }
        } catch (error) {
            console.log('📊 Usando contador padrão');
            this.updateCounter(1247);
        }
    }
    
    updateCounter(value) {
        const counterElement = document.querySelector('.counter-value');
        if (counterElement) {
            // Animação de contagem
            let current = 0;
            const increment = Math.ceil(value / 50);
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    current = value;
                    clearInterval(timer);
                }
                counterElement.textContent = current.toLocaleString('pt-BR');
                counterElement.classList.add('counting');
                setTimeout(() => counterElement.classList.remove('counting'), 500);
            }, 30);
        }
    }
    
    setupEventListeners() {
        // Evento: Cálculo solicitado
        this.eventBus.subscribe('calculate', async (data) => {
            await this.handleCalculation(data);
        });
        
        // Evento: Localização solicitada
        this.eventBus.subscribe('requestLocation', async () => {
            await this.loadLocationData();
        });
        
        // Evento: Clima solicitado
        this.eventBus.subscribe('requestWeather', async (city) => {
            await this.loadWeatherData(city);
        });
    }
    
    async loadLocationData() {
        try {
            // Timeout de 3 segundos para não travar
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 3000)
            );
            
            const locationPromise = this.api.getLocation();
            
            const response = await Promise.race([locationPromise, timeoutPromise]);
            
            if (response && response.success) {
                this.state.location = response.data;
                this.eventBus.notify('locationLoaded', response.data);
                console.log('📍 Localização:', response.data);
                
                // Carregar clima automaticamente após obter localização
                await this.loadWeatherData(response.data.city || 'São Paulo');
            } else {
                throw new Error('Resposta inválida');
            }
        } catch (error) {
            console.log('📍 Usando localização padrão');
            // Usar localização padrão (sem erro, é esperado)
            this.state.location = { 
                countryCode: 'BR', 
                country: 'Brasil',
                city: 'São Paulo'
            };
            this.eventBus.notify('locationLoaded', this.state.location);
            
            // Carregar clima mesmo com localização padrão
            await this.loadWeatherData('São Paulo');
        }
    }
    
    async loadWeatherData(city) {
        try {
            const response = await this.api.getWeather(city);
            
            if (response && (response.success || response.data)) {
                this.state.weather = response.data;
                this.eventBus.notify('weatherLoaded', response.data);
                console.log('🌤️ Clima:', response.data);
            } else {
                // Fallback com dados padrão
                const defaultWeather = {
                    city: city,
                    temp: 25,
                    condition: 'Clima agradável',
                    simulated: true
                };
                this.state.weather = defaultWeather;
                this.eventBus.notify('weatherLoaded', defaultWeather);
            }
        } catch (error) {
            console.log('🌤️ Usando dados climáticos simulados');
            // Dados padrão em caso de erro
            const defaultWeather = {
                city: city,
                temp: 25,
                condition: 'Clima agradável',
                simulated: true
            };
            this.state.weather = defaultWeather;
            this.eventBus.notify('weatherLoaded', defaultWeather);
        }
    }
    
    async handleCalculation(userData) {
        try {
            this.ui.showLoading('Calculando pegada de carbono...');
            
            // Adicionar país do usuário aos dados
            const dataWithLocation = {
                ...userData,
                country: this.state.location?.countryCode || 'BR'
            };
            
            // Calcular usando a API
            const apiResponse = await this.api.calculateCarbon(dataWithLocation);
            
            if (apiResponse.success) {
                // Incrementar contador de cálculos
                try {
                    const statsResponse = await this.api.post('/stats/increment', {});
                    if (statsResponse && statsResponse.success) {
                        console.log('📊 Contador atualizado:', statsResponse.data.totalCalculations);
                    }
                } catch (error) {
                    console.log('⚠️ Não foi possível atualizar contador');
                }
                
                // Também calcular localmente usando Factory Pattern
                const calculator = CalculatorFactory.createCalculator(
                    'advanced',
                    { regionalFactor: apiResponse.data.regionalFactor }
                );
                
                const localResult = calculator.calculate(userData);
                
                // Combinar resultados
                const result = {
                    ...apiResponse.data,
                    localCalculation: localResult,
                    location: this.state.location,
                    weather: this.state.weather
                };
                
                this.eventBus.notify('calculationComplete', result);
                console.log('✅ Cálculo completo:', result);
            }
        } catch (error) {
            console.error('Erro no cálculo:', error);
            this.eventBus.notify('calculationError', error);
        } finally {
            this.ui.hideLoading();
        }
    }
}

// Inicializar aplicação quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.carbonApp = new CarbonCalculatorApp();
    });
} else {
    window.carbonApp = new CarbonCalculatorApp();
}