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
            console.log('📍 Detectando localização do usuário...');
            
            // Chamar IP-API DIRETAMENTE do navegador (não passa pelo servidor!)
            // Isso pega o IP REAL do usuário, não o IP do servidor Railway
            // Usar HTTPS para evitar Mixed Content no Railway
            const response = await fetch('https://ipapi.co/json/');
            
            console.log('📍 Status da resposta:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Falha na geolocalização: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📍 Dados completos da API:', data);
            
            if (data.city) {
                this.state.location = {
                    country: data.country_name,
                    countryCode: data.country_code,
                    city: data.city,
                    region: data.region,
                    lat: data.latitude,
                    lon: data.longitude,
                    ip: data.ip
                };
                
                this.eventBus.notify('locationLoaded', this.state.location);
                console.log('✅ Localização detectada:', this.state.location);
                
                // Carregar clima automaticamente após obter localização
                await this.loadWeatherData(this.state.location.city || 'São Paulo');
            } else {
                console.error('❌ API retornou dados sem city:', data);
                throw new Error('Resposta inválida - sem city');
            }
        } catch (error) {
            console.error('❌ Erro na geolocalização:', error);
            console.log('📍 Usando localização padrão (São Paulo)');
            // Usar localização padrão (sem erro, é esperado)
            this.state.location = { 
                countryCode: 'BR', 
                country: 'Brazil',
                city: 'São Paulo',
                region: 'São Paulo'
            };
            this.eventBus.notify('locationLoaded', this.state.location);
            
            // Carregar clima mesmo com localização padrão
            await this.loadWeatherData('São Paulo');
        }
    }
    
    async loadWeatherData(city) {
        try {
            console.log('🌤️ Buscando clima para:', city);
            
            // Chamar OpenWeather API DIRETAMENTE do navegador
            const API_KEY = '146f92a8656aa0b3996755ddfa0ae720';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Falha na API de clima');
            }
            
            const data = await response.json();
            
            if (data.main && data.weather) {
                const weatherData = {
                    city: data.name,
                    temp: Math.round(data.main.temp),
                    condition: data.weather[0].description,
                    humidity: data.main.humidity,
                    simulated: false
                };
                
                this.state.weather = weatherData;
                this.eventBus.notify('weatherLoaded', weatherData);
                console.log('🌤️ Clima:', weatherData);
            } else {
                throw new Error('Dados inválidos');
            }
        } catch (error) {
            console.log('🌤️ Usando dados climáticos simulados');
            // Dados padrão em caso de erro
            const defaultWeather = {
                city: city,
                temp: 25,
                condition: 'Clima agradável',
                humidity: 60,
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