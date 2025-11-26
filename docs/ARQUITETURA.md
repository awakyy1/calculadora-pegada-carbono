# 🏗️ Documentação da Arquitetura

## Visão Geral

Este documento detalha a arquitetura do projeto Calculadora de Pegada de Carbono, demonstrando a implementação de conceitos modernos de desenvolvimento de software.

## Arquitetura de Microserviços

### Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │    Nginx (Reverse Proxy)      │
        │     Load Balancer              │
        └───────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Kubernetes Service          │
        │   (LoadBalancer)               │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌───────────────┐
│   Pod 1       │              │   Pod 2       │
│ (Replica 1)   │              │ (Replica 2)   │
└───────┬───────┘              └───────┬───────┘
        │                               │
        └───────────────┬───────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Express Server       │
            │  (Node.js)            │
            ├───────────────────────┤
            │  - API Routes         │
            │  - Controllers        │
            │  - Business Logic     │
            └───────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ OpenWeather│  │  IP-API    │  │   Redis    │
│    API     │  │ (GeoLoc)   │  │  (Cache)   │
└────────────┘  └────────────┘  └────────────┘
```

## Design Patterns

### 1. Singleton Pattern

**Classe**: `ConfigManager`  
**Objetivo**: Garantir uma única instância de configuração global

```javascript
class ConfigManager {
    static instance = null;
    
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        this.config = { /* ... */ };
        ConfigManager.instance = this;
    }
    
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
}
```

**Benefícios**:
- Ponto único de acesso a configurações
- Evita duplicação de estado
- Facilita testes e manutenção

### 2. Observer Pattern

**Classe**: `Observer`  
**Objetivo**: Sistema de eventos desacoplado

```javascript
class Observer {
    subscribe(event, callback) { /* ... */ }
    notify(event, data) { /* ... */ }
}
```

**Uso no Projeto**:
```javascript
// Componente A publica
eventBus.notify('calculationComplete', result);

// Componente B escuta
eventBus.subscribe('calculationComplete', (result) => {
    displayResult(result);
});
```

**Benefícios**:
- Desacoplamento entre componentes
- Fácil adição de novos observadores
- Fluxo de dados unidirecional claro

### 3. Factory Pattern

**Classe**: `CalculatorFactory`  
**Objetivo**: Criação de diferentes tipos de calculadoras

```javascript
class CalculatorFactory {
    static createCalculator(type, options) {
        switch(type) {
            case 'basic':
                return new BasicCalculationStrategy();
            case 'advanced':
                return new AdvancedCalculationStrategy(options);
        }
    }
}
```

**Benefícios**:
- Encapsula lógica de criação
- Facilita extensão (novos tipos)
- Reduz acoplamento

### 4. Strategy Pattern

**Classes**: `BasicCalculationStrategy`, `AdvancedCalculationStrategy`  
**Objetivo**: Diferentes algoritmos de cálculo intercambiáveis

```javascript
class CalculationStrategy {
    calculate(data) { /* interface */ }
}

class BasicCalculationStrategy extends CalculationStrategy {
    calculate(data) {
        // Cálculo simples
    }
}

class AdvancedCalculationStrategy extends CalculationStrategy {
    calculate(data) {
        // Cálculo com fatores regionais
    }
}
```

**Benefícios**:
- Algoritmos intercambiáveis em tempo de execução
- Facilita testes unitários
- Extensível para novos algoritmos

## Fluxo de Dados

### 1. Inicialização da Aplicação

```
User acessa página
    ↓
DOMContentLoaded evento
    ↓
CarbonCalculatorApp.init()
    ↓
├─ Carrega ConfigManager (Singleton)
├─ Inicializa Observer (EventBus)
├─ Cria ApiService
├─ Inicializa UIManager
└─ Carrega dados de localização (API)
```

### 2. Fluxo de Cálculo

```
Usuário preenche formulário
    ↓
Clica em "Calcular"
    ↓
UIManager.handleCalculate()
    ↓
EventBus.notify('calculate', userData)
    ↓
CarbonCalculatorApp.handleCalculation()
    ↓
├─ POST /api/calculate (Backend)
│   ├─ Aplica fatores regionais
│   └─ Retorna resultado
│
├─ CalculatorFactory.createCalculator()
│   └─ Cálculo local (validação)
│
└─ EventBus.notify('calculationComplete')
    ↓
UIManager exibe resultado
```

## Integração com APIs

### API Flow

```
Frontend (Browser)
    │
    ├─── GET /api/location
    │       │
    │       └─→ Backend → IP-API.com
    │           └─→ Retorna país/cidade
    │
    ├─── GET /api/weather/:city
    │       │
    │       └─→ Backend → OpenWeather API
    │           └─→ Retorna clima
    │
    └─── POST /api/calculate
            │
            └─→ Backend processa
                ├─ Fatores regionais
                ├─ Cálculo de CO2
                └─→ Retorna resultado
```

## Containerização (Docker)

### Dockerfile - Multi-stage Build

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
USER nodejs
CMD ["node", "server.js"]
```

**Características**:
- Imagem leve (Alpine Linux)
- Usuário não-root (segurança)
- Health checks integrados
- Otimizado para produção

### Docker Compose

**Serviços**:
1. **carbon-calculator**: Aplicação principal
2. **redis**: Cache (opcional, para escalar)
3. **nginx**: Reverse proxy e load balancer

## Orquestração Kubernetes

### Componentes K8s

#### 1. Deployment
```yaml
replicas: 3
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

- **3 réplicas** para alta disponibilidade
- **Resource limits** previnem consumo excessivo
- **Rolling updates** para deploy sem downtime

#### 2. Service (LoadBalancer)
```yaml
type: LoadBalancer
ports:
  - port: 80
    targetPort: 3000
```

- Distribui tráfego entre pods
- IP externo para acesso
- Session affinity (ClientIP)

#### 3. HorizontalPodAutoscaler
```yaml
minReplicas: 2
maxReplicas: 10
metrics:
  - CPU: 70%
  - Memory: 80%
```

- **Auto-scaling** baseado em métricas
- **Scale up rápido**, scale down gradual
- Suporta até 10 réplicas

#### 4. ConfigMap & Secrets
- **ConfigMap**: Configurações não sensíveis
- **Secrets**: API keys e credenciais
- Externalizados do código

#### 5. Ingress
```yaml
host: carbon-calculator.example.com
tls: enabled
```

- Roteamento HTTP/HTTPS
- Certificado SSL via cert-manager
- Redirecionamento HTTPS

### Health Checks

#### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
```

- Verifica se pod está "vivo"
- Reinicia pod se falhar

#### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

- Verifica se pod está pronto para receber tráfego
- Remove do load balancer se falhar

## Protocolos e Comunicação

### HTTP/REST

**Endpoints**:
- `GET /api/location` - Geolocalização
- `GET /api/weather/:city` - Clima
- `POST /api/calculate` - Cálculo
- `GET /health` - Health check
- `GET /ready` - Readiness

**Headers**:
```
Content-Type: application/json
X-Real-IP: <client-ip>
X-Forwarded-For: <proxy-chain>
```

### JSON Data Exchange

**Request Example**:
```json
{
  "kmCarro": 100,
  "refeicoesCarne": 10,
  "energiaEletrica": 50,
  "transporte": 30,
  "country": "BR"
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "co2Semanal": "45.50",
    "co2Anual": "2366.00",
    "classification": "Bom",
    "regionalFactor": 1.0
  }
}
```

## Escalabilidade

### Horizontal Scaling

1. **Kubernetes HPA**: Adiciona/remove pods automaticamente
2. **Load Balancer**: Distribui tráfego uniformemente
3. **Stateless**: Aplicação sem estado permite múltiplas instâncias

### Vertical Scaling

- Ajustar `resources.limits` no Deployment
- Aumentar capacidade de CPU/memória por pod

### Caching (Redis)

```javascript
// Exemplo de uso futuro
const cachedResult = await redis.get(cacheKey);
if (cachedResult) return cachedResult;

const result = await calculateCarbon(data);
await redis.set(cacheKey, result, 'EX', 3600);
```

## Segurança

### Container Security
- ✅ Non-root user
- ✅ Minimal base image (Alpine)
- ✅ No secrets in image

### Kubernetes Security
- ✅ Secrets management
- ✅ Network policies (pode ser adicionado)
- ✅ RBAC (pode ser configurado)
- ✅ TLS/SSL via Ingress

### API Security
- ✅ CORS configurado
- ✅ Rate limiting (pode ser adicionado)
- ✅ Input validation

## Monitoramento e Observabilidade

### Logs
```javascript
console.log('🌍 Inicializando...');
console.error('❌ Erro:', error);
```

### Metrics (futuro)
- Prometheus + Grafana
- Métricas de CPU, memória, requests
- Custom metrics (cálculos por segundo)

### Tracing (futuro)
- Jaeger ou Zipkin
- Rastreamento de requisições entre serviços

## Próximos Passos

1. **Implementar Redis** para caching
2. **Adicionar testes** (Jest, Mocha)
3. **CI/CD pipeline** (GitHub Actions, GitLab CI)
4. **Monitoring** (Prometheus, Grafana)
5. **Service Mesh** (Istio, Linkerd)
6. **API Gateway** (Kong, Ambassador)

---

Esta arquitetura demonstra princípios sólidos de:
- ✅ Separação de responsabilidades
- ✅ Escalabilidade
- ✅ Manutenibilidade
- ✅ Observabilidade
- ✅ Segurança

