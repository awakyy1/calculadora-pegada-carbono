# 🌍 Calculadora de Pegada de Carbono

## 📋 Descrição

Aplicação web moderna para cálculo de pegada de carbono com arquitetura de **microserviços**, integração com **APIs públicas** e implementação de **Design Patterns**. Projeto desenvolvido com foco em boas práticas de desenvolvimento de sistemas distribuídos.

## ✨ Funcionalidades

- 🧮 Cálculo de pegada de carbono personalizado
- 🌐 Integração com APIs públicas (Geolocalização, Clima)
- 📊 Cálculos regionalizados por país
- 💡 Dicas personalizadas para redução de emissões
- 🎨 Interface moderna e responsiva
- 🔄 Arquitetura escalável com microserviços

## 🏗️ Arquitetura e Tecnologias

### Requisitos Atendidos

✅ **1. Interface com usuário (Front-end)**
- HTML5, CSS3 (com animações e design responsivo)
- JavaScript ES6+ (Modules)
- Interface moderna e intuitiva

✅ **2 & 3. Integração com APIs públicas**
- **OpenWeather API**: Dados climáticos em tempo real
- **IP-API**: Geolocalização por IP (API pública gratuita)
- **API própria**: Cálculo de emissões e fatores regionais

✅ **4. Conceitos fundamentais de desenvolvimento**
- **Design Patterns implementados:**
  - **Singleton**: `ConfigManager` - Gerenciamento centralizado de configurações
  - **Observer**: `Observer` - Sistema de eventos e notificações
  - **Factory**: `CalculatorFactory` - Criação de diferentes tipos de calculadoras
  - **Strategy**: Diferentes estratégias de cálculo (básico/avançado)
  
- **Microserviços:**
  - Serviço principal (Node.js + Express)
  - Arquitetura containerizada com Docker
  - Orquestração com Docker Compose
  
- **Kubernetes:**
  - Deployment com 3 réplicas
  - Service (LoadBalancer)
  - HorizontalPodAutoscaler (auto-scaling)
  - ConfigMaps e Secrets
  - Ingress para roteamento
  - Health checks e readiness probes
  
- **Protocolos:**
  - HTTP/HTTPS para comunicação REST
  - JSON para troca de dados

## 📁 Estrutura do Projeto

```
calculadora-pegada-carbono/
├── src/
│   ├── index.html              # Interface principal
│   ├── styles.css              # Estilos modernos
│   └── js/
│       ├── app.js              # Aplicação principal
│       ├── ui.js               # Gerenciamento de UI
│       ├── calculator.js       # Lógica de cálculo
│       ├── config/
│       │   └── config.js       # Singleton: Configurações
│       ├── modules/
│       │   ├── Observer.js     # Pattern: Observer
│       │   └── CalculatorFactory.js  # Patterns: Factory + Strategy
│       └── api/
│           ├── ApiService.js   # Serviço de API
│           ├── routes.js       # Rotas da API
│           └── controllers.js  # Controladores
├── k8s/
│   ├── deployment.yaml         # Deploy Kubernetes
│   ├── service.yaml            # Serviço K8s
│   ├── configmap.yaml          # Configurações
│   ├── secrets.yaml            # Secrets
│   ├── hpa.yaml                # Auto-scaling
│   └── ingress.yaml            # Roteamento
├── server.js                   # Servidor Express
├── Dockerfile                  # Container Docker
├── docker-compose.yml          # Orquestração multi-container
├── nginx.conf                  # Reverse proxy
└── package.json                # Dependências

```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- Docker (opcional)
- Kubernetes/Minikube (opcional)

### Método 1: Execução Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (opcional)
cp .env.example .env
# Edite o arquivo .env com suas API keys

# 3. Iniciar o servidor
npm start

# 4. Acessar a aplicação
# http://localhost:3000
```

### Método 2: Docker

```bash
# Build da imagem
docker build -t carbon-calculator .

# Executar container
docker run -p 3000:3000 carbon-calculator

# Ou usar Docker Compose (com Redis e Nginx)
docker-compose up -d
```

### Método 3: Kubernetes

```bash
# 1. Build da imagem (se necessário)
docker build -t carbon-calculator:latest .

# 2. Aplicar configurações do Kubernetes
kubectl apply -f k8s/

# 3. Verificar pods
kubectl get pods

# 4. Acessar serviço
kubectl get services
```

## 🎨 Design Patterns Implementados

### 1. Singleton Pattern
**Arquivo**: `src/js/config/config.js`

Garante uma única instância do gerenciador de configurações em toda a aplicação.

```javascript
const config = ConfigManager.getInstance();
```

### 2. Observer Pattern
**Arquivo**: `src/js/modules/Observer.js`

Sistema de eventos para comunicação desacoplada entre componentes.

```javascript
eventBus.subscribe('calculationComplete', (data) => {
    // Reagir ao evento
});
eventBus.notify('calculationComplete', result);
```

### 3. Factory Pattern
**Arquivo**: `src/js/modules/CalculatorFactory.js`

Cria diferentes tipos de calculadoras sem expor lógica de criação.

```javascript
const calculator = CalculatorFactory.createCalculator('advanced', {
    regionalFactor: 1.2
});
```

### 4. Strategy Pattern
**Arquivo**: `src/js/modules/CalculatorFactory.js`

Diferentes estratégias de cálculo (básico, avançado) intercambiáveis.

## 🌐 APIs Integradas

### 1. OpenWeather API
- **Endpoint**: `/api/weather/:city`
- **Função**: Obter dados climáticos em tempo real
- **Documentação**: https://openweathermap.org/api

### 2. IP-API (Geolocalização)
- **Endpoint**: `/api/location`
- **Função**: Geolocalização por IP
- **API pública gratuita**: http://ip-api.com

### 3. API Própria de Cálculo
- **POST** `/api/calculate` - Calcular pegada de carbono
- **GET** `/api/emission-factors/:country` - Fatores de emissão por país

## ☸️ Kubernetes - Recursos

### Deployment
- **3 réplicas** para alta disponibilidade
- **Resource limits**: CPU e memória controlados
- **Health checks**: Liveness e Readiness probes

### Auto-Scaling (HPA)
- **Min**: 2 réplicas
- **Max**: 10 réplicas
- **Métricas**: CPU (70%) e Memória (80%)

### Service
- **Tipo**: LoadBalancer
- **Porta**: 80 → 3000
- **Session Affinity**: ClientIP

### ConfigMap & Secrets
- Configurações externalizadas
- Secrets para API keys

## 🔧 Variáveis de Ambiente

```env
PORT=3000
NODE_ENV=development
OPENWEATHER_API_KEY=sua_chave_aqui
CARBON_INTERFACE_API_KEY=sua_chave_aqui
```

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/calculate` | Calcula pegada de carbono |
| GET | `/api/weather/:city` | Dados climáticos |
| GET | `/api/location` | Geolocalização do usuário |
| GET | `/api/emission-factors/:country` | Fatores de emissão |
| GET | `/health` | Health check (K8s) |
| GET | `/ready` | Readiness probe (K8s) |

## 🧪 Testes

### Health Check
```bash
curl http://localhost:3000/health
```

### Calcular CO2
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"kmCarro": 100, "refeicoesCarne": 10, "energiaEletrica": 50, "transporte": 30, "country": "BR"}'
```

## 📈 Escalabilidade

### Docker Compose
O projeto inclui:
- **Redis**: Cache para melhor performance
- **Nginx**: Reverse proxy e load balancing
- **Auto-restart**: Containers reiniciam automaticamente

### Kubernetes
- **HPA**: Auto-scaling baseado em CPU/memória
- **Multiple replicas**: Alta disponibilidade
- **Rolling updates**: Deploy sem downtime
- **Resource management**: Limites de CPU e memória

## 🛡️ Segurança

- Container roda com usuário não-root
- Secrets gerenciados pelo Kubernetes
- API keys não expostas no código
- CORS configurado
- Health checks para monitoramento

## 🎓 Conceitos Demonstrados

### Desenvolvimento de Componentes Distribuídos
- ✅ Microserviços containerizados
- ✅ Comunicação via APIs REST
- ✅ Orquestração com Docker e Kubernetes

### Design Patterns
- ✅ Singleton, Observer, Factory, Strategy
- ✅ Separação de responsabilidades
- ✅ Código modular e reutilizável

### Protocolos e Padrões
- ✅ HTTP/REST
- ✅ JSON para troca de dados
- ✅ Health checks e probes

### DevOps
- ✅ Containerização (Docker)
- ✅ Orquestração (Kubernetes)
- ✅ CI/CD ready
- ✅ Configuração externalizada

## 📝 Comandos Úteis

```bash
# Development
npm run dev              # Modo desenvolvimento com nodemon

# Docker
npm run docker:build     # Build da imagem
npm run docker:run       # Executar container

# Kubernetes
npm run k8s:apply        # Aplicar configs K8s
npm run k8s:delete       # Remover recursos K8s

# Verificar status
kubectl get all          # Ver todos os recursos
kubectl logs <pod-name>  # Ver logs
kubectl describe pod <pod-name>  # Detalhes do pod
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Autores

Desenvolvido como projeto acadêmico demonstrando:
- Arquitetura de microserviços
- Integração com APIs públicas
- Design Patterns
- Kubernetes e containerização

## 🔗 Links Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Express.js](https://expressjs.com/)
- [OpenWeather API](https://openweathermap.org/api)

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**
