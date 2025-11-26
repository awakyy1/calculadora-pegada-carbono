import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Controller para calcular pegada de carbono
export const calculateCarbon = async (req, res) => {
    try {
        const { kmCarro, refeicoesCarne, energiaEletrica, transporte, country } = req.body;
        
        // Fatores regionais por país
        const regionalFactors = {
            'BR': 1.0,  // Brasil
            'US': 1.3,  // Estados Unidos
            'CN': 1.5,  // China
            'DE': 0.8,  // Alemanha
            'default': 1.0
        };
        
        const factor = regionalFactors[country] || regionalFactors['default'];
        
        let co2Semanal = 0;
        co2Semanal += (kmCarro || 0) * 0.2 * factor;
        co2Semanal += (refeicoesCarne || 0) * 2.5 * factor;
        co2Semanal += (energiaEletrica || 0) * 0.5 * factor;
        co2Semanal += (transporte || 0) * 0.05 * factor;
        
        const co2Anual = co2Semanal * 52;
        
        // Classificação baseada em emissões anuais
        let classification = '';
        if (co2Anual < 2000) classification = 'Excelente';
        else if (co2Anual < 4000) classification = 'Bom';
        else if (co2Anual < 6000) classification = 'Médio';
        else classification = 'Alto';
        
        res.json({
            success: true,
            data: {
                co2Semanal: co2Semanal.toFixed(2),
                co2Anual: co2Anual.toFixed(2),
                classification,
                regionalFactor: factor,
                country: country || 'BR',
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Controller para obter dados climáticos (OpenWeather API)
export const getWeatherData = async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        
        // Dados simulados baseados na cidade
        const simulatedData = {
            'São Paulo': { temp: 24, condition: 'Parcialmente nublado', humidity: 65 },
            'Rio de Janeiro': { temp: 28, condition: 'Ensolarado', humidity: 70 },
            'Brasília': { temp: 26, condition: 'Céu limpo', humidity: 45 },
            'Belo Horizonte': { temp: 23, condition: 'Nublado', humidity: 60 },
            'default': { temp: 25, condition: 'Clima agradável', humidity: 60 }
        };
        
        // Se não tiver API key, usa dados simulados
        if (!apiKey) {
            const cityData = simulatedData[city] || simulatedData['default'];
            return res.json({
                success: true,
                data: {
                    city: city,
                    temp: cityData.temp,
                    condition: cityData.condition,
                    humidity: cityData.humidity,
                    simulated: true
                }
            });
        }
        
        // Tenta usar a API real
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`,
                { timeout: 5000 } // 5 segundos de timeout
            );
            
            res.json({
                success: true,
                data: {
                    city: response.data.name,
                    temp: Math.round(response.data.main.temp),
                    condition: response.data.weather[0].description,
                    humidity: response.data.main.humidity,
                    country: response.data.sys.country,
                    simulated: false
                }
            });
        } catch (apiError) {
            // Se a API falhar, usa dados simulados
            const cityData = simulatedData[city] || simulatedData['default'];
            res.json({
                success: true,
                data: {
                    city: city,
                    temp: cityData.temp,
                    condition: cityData.condition,
                    humidity: cityData.humidity,
                    simulated: true
                }
            });
        }
    } catch (error) {
        // Fallback final
        res.json({
            success: true,
            data: {
                city: req.params.city || 'Brasil',
                temp: 25,
                condition: 'Clima agradável',
                humidity: 60,
                simulated: true
            }
        });
    }
};

// Controller para obter dados de localização (usando IP)
export const getLocationData = async (req, res) => {
    try {
        // Usando API pública gratuita de geolocalização por IP
        const response = await axios.get('http://ip-api.com/json/');
        
        res.json({
            success: true,
            data: {
                country: response.data.country,
                countryCode: response.data.countryCode,
                city: response.data.city,
                region: response.data.regionName,
                lat: response.data.lat,
                lon: response.data.lon
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Erro ao obter localização',
            data: {
                country: 'Brasil',
                countryCode: 'BR',
                city: 'São Paulo'
            }
        });
    }
};

// Controller para obter fatores de emissão por país
export const getEmissionFactors = async (req, res) => {
    try {
        const { country } = req.params;
        
        // Dados simulados de fatores de emissão por país
        const emissionFactors = {
            'BR': {
                electricity: 0.45,
                transport: 0.19,
                meat: 2.3,
                description: 'Brasil tem matriz energética relativamente limpa'
            },
            'US': {
                electricity: 0.65,
                transport: 0.25,
                meat: 3.0,
                description: 'Estados Unidos com alta dependência de combustíveis fósseis'
            },
            'DE': {
                electricity: 0.40,
                transport: 0.15,
                meat: 2.0,
                description: 'Alemanha com forte investimento em energias renováveis'
            },
            'default': {
                electricity: 0.50,
                transport: 0.20,
                meat: 2.5,
                description: 'Fatores médios globais'
            }
        };
        
        const factors = emissionFactors[country] || emissionFactors['default'];
        
        res.json({
            success: true,
            data: {
                country,
                factors,
                unit: 'kg CO2'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

