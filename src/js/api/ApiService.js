/**
 * Serviço para comunicação com APIs
 * Implementa padrão de comunicação centralizada
 */
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }
    
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
    
    // Métodos específicos da aplicação
    async calculateCarbon(data) {
        return this.post('/calculate', data);
    }
    
    async getWeather(city) {
        return this.get(`/weather/${city}`);
    }
    
    async getLocation() {
        return this.get('/location');
    }
    
    async getEmissionFactors(country) {
        return this.get(`/emission-factors/${country}`);
    }
}

export default ApiService;

