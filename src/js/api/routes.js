import express from 'express';
import { 
    calculateCarbon, 
    getWeatherData, 
    getLocationData,
    getEmissionFactors 
} from './controllers.js';
import { getStats, incrementCalculations } from './statsController.js';

const router = express.Router();

// Rota para calcular pegada de carbono
router.post('/calculate', calculateCarbon);

// Rota para obter dados climáticos
router.get('/weather/:city', getWeatherData);

// Rota para obter dados de localização
router.get('/location', getLocationData);

// Rota para obter fatores de emissão por país
router.get('/emission-factors/:country', getEmissionFactors);

// Rotas de estatísticas
router.get('/stats', getStats);
router.post('/stats/increment', incrementCalculations);

export default router;

