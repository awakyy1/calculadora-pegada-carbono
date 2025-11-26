# 🚀 Guia Rápido de Início

## Começar em 3 Passos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Iniciar o Servidor

```bash
npm start
```

### 3️⃣ Abrir no Navegador

```
http://localhost:3000
```

---

## 🎉 Pronto!

A aplicação está rodando e totalmente funcional.

### Funcionalidades Disponíveis

✅ **Interface Moderna** - HTML, CSS, JavaScript  
✅ **APIs Integradas** - Geolocalização e Clima automáticos  
✅ **Cálculos Regionalizados** - Baseado no seu país  
✅ **Design Patterns** - Singleton, Observer, Factory  
✅ **Arquitetura de Microserviços** - Pronta para Docker/Kubernetes  

---

## 📦 Deploy com Docker (Opcional)

```bash
# Build e executar
docker build -t carbon-calculator .
docker run -p 3000:3000 carbon-calculator

# Ou usar Docker Compose
docker-compose up -d
```

---

## ☸️ Deploy no Kubernetes (Opcional)

```bash
# Aplicar todas as configurações
kubectl apply -f k8s/

# Verificar
kubectl get pods
```

---

## 🔑 API Keys (Opcional)

As APIs funcionam mesmo sem chaves. Para dados reais de clima:

1. Crie conta grátis em https://openweathermap.org/api
2. Copie sua API key
3. Edite o arquivo `.env`:

```env
OPENWEATHER_API_KEY=sua_chave_aqui
```

4. Reinicie o servidor

---

## 📚 Documentação Completa

- **README.md** - Visão geral e funcionalidades
- **docs/ARQUITETURA.md** - Detalhes técnicos e design patterns
- **docs/API.md** - Documentação da API REST
- **docs/DEPLOY.md** - Guia completo de deploy

---

## ✅ Requisitos Atendidos

### 1. Interface Front-end ✅
- HTML5 moderno
- CSS3 com animações
- JavaScript ES6+ com modules

### 2 & 3. APIs Públicas ✅
- **IP-API**: Geolocalização (gratuita)
- **OpenWeather**: Dados climáticos
- **API REST própria**: Cálculos

### 4. Conceitos Fundamentais ✅
- **Design Patterns**: Singleton, Observer, Factory, Strategy
- **Microserviços**: Arquitetura modular e escalável
- **Docker**: Containerização completa
- **Kubernetes**: Orquestração com auto-scaling
- **Protocolos**: HTTP/REST, JSON

---

## 🎯 Testando as Funcionalidades

### 1. Teste a Interface

1. Abra http://localhost:3000
2. Clique em "Começar"
3. Preencha os campos
4. Veja o resultado com sua localização automática

### 2. Teste a API

```bash
# Health check
curl http://localhost:3000/health

# Geolocalização
curl http://localhost:3000/api/location

# Calcular CO2
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"kmCarro":100,"refeicoesCarne":10}'
```

---

## 🐛 Problemas?

### Porta 3000 ocupada?

Edite `.env` e mude a porta:
```env
PORT=3001
```

### Erros de instalação?

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install
```

---

## 💡 Dicas

- Use `npm run dev` para desenvolvimento com auto-reload
- As APIs funcionam sem chaves (usam dados simulados)
- Abra o console do navegador (F12) para ver logs
- Verifique `docs/` para documentação detalhada

---

## 🎨 Personalize

O projeto está pronto para ser estendido:

- Adicione novos campos no formulário
- Crie novos tipos de calculadoras (Factory Pattern)
- Integre mais APIs
- Customize os estilos em `src/styles.css`

---

## 📞 Suporte

Leia a documentação completa em:
- README.md
- docs/ARQUITETURA.md
- docs/API.md
- docs/DEPLOY.md

---

**🌍 Ajude o planeta calculando sua pegada de carbono!**

