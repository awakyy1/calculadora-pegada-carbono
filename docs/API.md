# 📡 Documentação da API

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Calcular Pegada de Carbono

Calcula a pegada de carbono baseada nas atividades do usuário.

**Endpoint:** `POST /api/calculate`

**Request Body:**
```json
{
  "kmCarro": 100,
  "refeicoesCarne": 10,
  "energiaEletrica": 50,
  "transporte": 30,
  "country": "BR"
}
```

**Parâmetros:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| kmCarro | number | Não | Quilômetros de carro por semana |
| refeicoesCarne | number | Não | Refeições com carne por semana |
| energiaEletrica | number | Não | Consumo de energia (kWh) por semana |
| transporte | number | Não | Km em transporte público por semana |
| country | string | Não | Código do país (ISO 3166-1 alpha-2) |

**Response:**
```json
{
  "success": true,
  "data": {
    "co2Semanal": "45.50",
    "co2Anual": "2366.00",
    "classification": "Bom",
    "regionalFactor": 1.0,
    "country": "BR",
    "timestamp": "2025-11-25T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Sucesso
- `500 Internal Server Error` - Erro no servidor

---

### 2. Obter Dados Climáticos

Obtém informações climáticas de uma cidade.

**Endpoint:** `GET /api/weather/:city`

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| city | string | Nome da cidade |

**Exemplo:**
```
GET /api/weather/São Paulo
```

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "São Paulo",
    "temp": 25.5,
    "condition": "céu limpo",
    "humidity": 65,
    "country": "BR"
  }
}
```

**Response (fallback sem API key):**
```json
{
  "success": false,
  "message": "API key não configurada. Usando dados simulados.",
  "data": {
    "city": "São Paulo",
    "temp": 25,
    "condition": "Clear",
    "simulated": true
  }
}
```

---

### 3. Obter Localização do Usuário

Obtém a localização baseada no IP do usuário.

**Endpoint:** `GET /api/location`

**Request:**
```
GET /api/location
```

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "Brazil",
    "countryCode": "BR",
    "city": "São Paulo",
    "region": "São Paulo",
    "lat": -23.5475,
    "lon": -46.6361
  }
}
```

**Nota:** Usa a API pública gratuita http://ip-api.com/

---

### 4. Obter Fatores de Emissão

Retorna os fatores de emissão de CO₂ para um país específico.

**Endpoint:** `GET /api/emission-factors/:country`

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| country | string | Código do país (BR, US, DE, etc.) |

**Exemplo:**
```
GET /api/emission-factors/BR
```

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "BR",
    "factors": {
      "electricity": 0.45,
      "transport": 0.19,
      "meat": 2.3,
      "description": "Brasil tem matriz energética relativamente limpa"
    },
    "unit": "kg CO2"
  }
}
```

**Países Suportados:**
- `BR` - Brasil
- `US` - Estados Unidos
- `DE` - Alemanha
- `default` - Valores médios globais

---

## Health Checks

### Liveness Probe

Verifica se a aplicação está funcionando.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-25T10:30:00.000Z"
}
```

### Readiness Probe

Verifica se a aplicação está pronta para receber tráfego.

**Endpoint:** `GET /ready`

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2025-11-25T10:30:00.000Z"
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Exemplos de Uso

### cURL

```bash
# Calcular pegada de carbono
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "kmCarro": 100,
    "refeicoesCarne": 10,
    "energiaEletrica": 50,
    "transporte": 30,
    "country": "BR"
  }'

# Obter clima
curl http://localhost:3000/api/weather/São%20Paulo

# Obter localização
curl http://localhost:3000/api/location

# Obter fatores de emissão
curl http://localhost:3000/api/emission-factors/BR
```

### JavaScript (Fetch)

```javascript
// Calcular pegada
const response = await fetch('http://localhost:3000/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    kmCarro: 100,
    refeicoesCarne: 10,
    energiaEletrica: 50,
    transporte: 30,
    country: 'BR'
  })
});

const data = await response.json();
console.log(data);
```

### Python (requests)

```python
import requests

# Calcular pegada
response = requests.post('http://localhost:3000/api/calculate', 
  json={
    'kmCarro': 100,
    'refeicoesCarne': 10,
    'energiaEletrica': 50,
    'transporte': 30,
    'country': 'BR'
  }
)

print(response.json())
```

---

## Rate Limiting

Atualmente não há rate limiting implementado. Em produção, recomenda-se:
- 100 requisições por minuto por IP
- 1000 requisições por hora por IP

---

## CORS

CORS está habilitado para todas as origens em desenvolvimento. Em produção, configure origens específicas:

```javascript
app.use(cors({
  origin: ['https://seu-dominio.com']
}));
```

---

## Autenticação

Atualmente não há autenticação. Para produção, considere:
- API Keys
- OAuth 2.0
- JWT tokens

---

## Erros Comuns

### 1. API Key não configurada

```json
{
  "success": false,
  "message": "API key não configurada. Usando dados simulados.",
  "data": { ... }
}
```

**Solução:** Configure as variáveis de ambiente no arquivo `.env`

### 2. Cidade não encontrada

```json
{
  "success": false,
  "message": "Erro ao obter dados climáticos. Usando dados simulados.",
  "data": { ... }
}
```

**Solução:** Verifique o nome da cidade ou use uma cidade diferente

---

## APIs Externas Utilizadas

### 1. OpenWeather API
- **URL:** https://openweathermap.org/api
- **Uso:** Dados climáticos em tempo real
- **Requer:** API Key gratuita

### 2. IP-API
- **URL:** http://ip-api.com/
- **Uso:** Geolocalização por IP
- **Gratuita:** Sim (sem API key necessária)

---

## Versionamento

Versão atual: **v1.0.0**

Formato de versionamento: Semantic Versioning (SemVer)
- MAJOR: Mudanças incompatíveis na API
- MINOR: Novas funcionalidades compatíveis
- PATCH: Correções de bugs

---

## Suporte

Para reportar problemas ou sugerir melhorias:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento


