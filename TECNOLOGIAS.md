# 🛠️ Tecnologias e APIs Utilizadas

## 📋 Visão Geral do Projeto
**Nome:** Calculadora de Pegada de Carbono  
**Tipo:** Aplicação Web Full-Stack  
**Arquitetura:** Microserviços com Containerização

---

## 🎨 Frontend

### Linguagens e Frameworks
- **HTML5** - Estrutura da página
- **CSS3** - Estilização e design responsivo
- **JavaScript (ES6+)** - Lógica da aplicação

### Bibliotecas e Recursos
- **Font Awesome 6.5.1** - Ícones profissionais
- **Google Fonts (Inter)** - Tipografia moderna
- **CSS Grid & Flexbox** - Layout responsivo
- **CSS Custom Properties** - Variáveis de design
- **CSS Animations** - Transições e efeitos visuais

### Padrões de Design Implementados
- **Singleton Pattern** - Gerenciamento de configuração
- **Observer Pattern** - Sistema de eventos
- **Factory Pattern** - Criação de elementos UI
- **Strategy Pattern** - Cálculos dinâmicos

### Funcionalidades Frontend
- ✅ Interface responsiva (mobile-first)
- ✅ Dashboard interativo com métricas
- ✅ Formulário intuitivo
- ✅ Contador de usuários persistente
- ✅ Animações e transições suaves
- ✅ LocalStorage para persistência de dados

---

## 🔧 Backend

### Runtime e Framework
- **Node.js 18** - Ambiente de execução
- **Express.js** - Framework web
- **CORS** - Controle de acesso entre origens
- **dotenv** - Gerenciamento de variáveis de ambiente

### Arquitetura
- **RESTful API** - Endpoints padronizados
- **MVC Pattern** - Separação de responsabilidades
- **Microservices** - Serviços independentes
- **Error Handling** - Tratamento centralizado de erros

### Estrutura de Pastas
```
src/js/
├── app.js              # Aplicação principal
├── ui.js               # Gerenciamento de UI
├── calculator.js       # Lógica de cálculos
├── config/             # Configurações
└── modules/            # Módulos reutilizáveis
```

---

## 🌐 APIs Integradas

### 1. **IP Geolocation API (ipapi.co)**
- **Tipo:** Geolocalização por IP
- **Endpoint:** `https://ipapi.co/json/`
- **Uso:** Detectar localização real do usuário
- **Dados Retornados:**
  - País (country_name, country_code)
  - Cidade (city)
  - Região (region)
  - Coordenadas (latitude, longitude)
- **Limite:** 1.000 requisições/dia (grátis)
- **Protocolo:** HTTPS ✅

### 2. **OpenWeather API**
- **Tipo:** Dados meteorológicos
- **Endpoint:** `https://api.openweathermap.org/data/2.5/weather`
- **API Key:** `146f92a8656aa0b3996755ddfa0ae720`
- **Uso:** Obter clima em tempo real
- **Dados Retornados:**
  - Temperatura (°C)
  - Condição climática (pt_br)
  - Umidade (%)
  - Nome da cidade
- **Limite:** 1.000 requisições/dia (grátis)
- **Protocolo:** HTTPS ✅
- **Idioma:** Português (pt_br)
- **Unidades:** Métricas (metric)

### 3. **API Interna de Cálculo de Carbono**
- **Tipo:** API REST customizada
- **Endpoint:** `/api/calculate`
- **Método:** POST
- **Uso:** Calcular pegada de carbono
- **Dados de Entrada:**
  ```json
  {
    "kmCarro": 100,
    "energiaKwh": 200,
    "refeicoesComCarne": 7,
    "comprasOnline": 5,
    "location": "São Paulo"
  }
  ```
- **Dados de Saída:**
  ```json
  {
    "total": 150.5,
    "breakdown": {
      "transporte": 50.2,
      "energia": 40.3,
      "alimentacao": 35.5,
      "consumo": 24.5
    },
    "rating": "Alto",
    "suggestions": ["..."]
  }
  ```

---

## 🐳 DevOps e Infraestrutura

### Containerização
- **Docker** - Containerização da aplicação
- **Dockerfile** - Build otimizado (Node.js Alpine)
- **Docker Compose** - Orquestração local
- **.dockerignore** - Otimização de build

### Orquestração
- **Kubernetes** - Deployment em produção
- **ConfigMaps** - Configurações
- **Secrets** - Dados sensíveis
- **HPA** - Auto-scaling horizontal
- **Ingress** - Roteamento de tráfego
- **Liveness/Readiness Probes** - Health checks

### Deploy e Hospedagem
- **Railway.app** - PaaS para deploy
- **GitHub** - Controle de versão
- **GitHub CLI** - Automação via CLI
- **Git** - Versionamento

### Arquivos de Configuração
- `Dockerfile` - Instruções de build
- `railway.json` - Config do Railway
- `.env` - Variáveis de ambiente
- `.gitignore` - Arquivos ignorados
- `package.json` - Dependências Node.js

---

## 📦 Dependências do Projeto

### Produção (package.json)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

### DevDependencies
```json
{
  "nodemon": "^2.0.22"
}
```

---

## 🔒 Segurança

### Implementações
- ✅ HTTPS em todas as APIs
- ✅ CORS configurado corretamente
- ✅ Variáveis de ambiente (.env)
- ✅ API keys protegidas (no frontend por necessidade)
- ✅ Validação de dados de entrada
- ✅ Error handling robusto
- ✅ Rate limiting nas APIs externas

### Protocolos
- **HTTPS/TLS** - Criptografia de dados
- **HTTP/2** - Performance otimizada
- **JSON** - Formato de dados padrão

---

## 💾 Persistência de Dados

### Client-Side
- **localStorage** - Armazenamento local do navegador
  - Contador de usuários
  - Timestamp da última atualização
  - Preferências do usuário

### Dados Armazenados
```javascript
{
  "userCount": 90,
  "lastUpdate": "2025-11-27T12:00:00.000Z"
}
```

---

## 🎯 Funcionalidades Especiais

### 1. **Contador Inteligente**
- Inicia em 90 usuários
- +1 a cada 20 horas (automático)
- +1 a cada cálculo realizado
- Persistido em localStorage
- Animação de contagem

### 2. **Dashboard Interativo**
- Métricas visuais com barras de progresso
- Comparações práticas (árvores, carros, energia)
- Equivalências do dia a dia
- Ações personalizadas por categoria
- Contexto regional com clima

### 3. **Formulário Intuitivo**
- Perguntas simples e claras
- Sliders visuais
- Radio buttons com ícones
- Validação em tempo real
- Feedback imediato

---

## 📊 Métricas de Performance

### Otimizações
- ✅ CSS minificado
- ✅ JavaScript modular
- ✅ Lazy loading de recursos
- ✅ Caching de APIs
- ✅ Compressão de assets
- ✅ Docker multi-stage (Alpine)

### Performance
- **Build Docker:** ~2 minutos
- **Deploy Railway:** ~2-3 minutos
- **Primeira carga:** < 2 segundos
- **APIs response:** < 500ms

---

## 🌍 Internacionalização

### Idiomas Suportados
- **Português (pt_br)** - Interface principal
- **Português (pt_br)** - OpenWeather API

---

## 📱 Compatibilidade

### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px+)
- ✅ Tablet (768px+)
- ✅ Mobile (375px+)

---

## 🔗 Links e Recursos

### Documentação das APIs
- **ipapi.co:** https://ipapi.co/api/
- **OpenWeather:** https://openweathermap.org/api
- **Font Awesome:** https://fontawesome.com/icons
- **Google Fonts:** https://fonts.google.com/specimen/Inter

### Repositório
- **GitHub:** https://github.com/awakyy1/calculadora-pegada-carbono

### Deploy
- **Railway:** https://railway.app/

---

## 🎓 Conceitos de Desenvolvimento

### Implementados no Projeto
1. ✅ **Design Patterns** (Singleton, Observer, Factory, Strategy)
2. ✅ **RESTful API** (Endpoints padronizados)
3. ✅ **Microservices** (Serviços independentes)
4. ✅ **Containerização** (Docker)
5. ✅ **Orquestração** (Kubernetes)
6. ✅ **CI/CD** (Railway + GitHub)
7. ✅ **SPA** (Single Page Application)
8. ✅ **Responsive Design** (Mobile-first)
9. ✅ **Event-Driven** (Observer pattern)
10. ✅ **Client-Side Storage** (localStorage)

---

## 📈 Estatísticas do Projeto

- **Linhas de Código:** ~2.500+
- **Arquivos:** 25+
- **APIs Integradas:** 3
- **Design Patterns:** 4
- **Tecnologias:** 15+
- **Ícones Font Awesome:** 20+
- **Endpoints REST:** 3+

---

## 🚀 Próximas Melhorias (Roadmap)

### Futuras Implementações
- [ ] Backend em PostgreSQL para histórico
- [ ] Autenticação de usuários (JWT)
- [ ] Gráficos com Chart.js
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Exportar relatório em PDF
- [ ] Multilíngue (EN, ES)
- [ ] Integração com Google Analytics
- [ ] Testes automatizados (Jest)
- [ ] CI/CD com GitHub Actions

---

**Última atualização:** 27/11/2025  
**Versão:** 2.0.0  
**Status:** ✅ Produção

