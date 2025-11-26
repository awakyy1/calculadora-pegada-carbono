# 📦 Guia de Instalação Completo

## 🎯 Escolha Seu Método de Instalação

### 🟢 Método 1: Instalação Rápida (Recomendado)
**Tempo estimado**: 2 minutos  
**Complexidade**: Fácil ⭐

### 🔵 Método 2: Docker
**Tempo estimado**: 5 minutos  
**Complexidade**: Média ⭐⭐

### 🟣 Método 3: Kubernetes
**Tempo estimado**: 10 minutos  
**Complexidade**: Avançada ⭐⭐⭐

---

## 🟢 Método 1: Instalação Local Rápida

### Pré-requisitos
- ✅ Node.js 18 ou superior
- ✅ npm (vem com Node.js)

### Verificar Node.js

**Windows:**
```powershell
node --version
npm --version
```

**Linux/Mac:**
```bash
node --version
npm --version
```

> Se não tiver Node.js instalado, baixe em: https://nodejs.org/

### Passo a Passo

#### 1️⃣ Instalar Dependências

**Windows:**
```powershell
npm install
```

**Linux/Mac:**
```bash
npm install
```

#### 2️⃣ Configurar Variáveis (Opcional)

As APIs funcionam sem configuração! Mas para dados reais de clima:

```powershell
# Windows
copy .env .env.local
notepad .env.local

# Linux/Mac
cp .env .env.local
nano .env.local
```

Edite e adicione sua API key (opcional):
```env
OPENWEATHER_API_KEY=sua_chave_aqui
```

> Obtenha uma chave gratuita em: https://openweathermap.org/api

#### 3️⃣ Iniciar o Servidor

```bash
npm start
```

Você verá:
```
🚀 Servidor rodando na porta 3000
📊 API disponível em http://localhost:3000/api
🌍 Frontend disponível em http://localhost:3000
```

#### 4️⃣ Abrir no Navegador

Abra seu navegador em:
```
http://localhost:3000
```

### ✅ Pronto! A aplicação está rodando!

---

## 🔵 Método 2: Instalação com Docker

### Pré-requisitos
- ✅ Docker instalado
- ✅ Docker Compose (opcional)

### Verificar Docker

```bash
docker --version
docker-compose --version
```

> Se não tiver Docker, baixe em: https://www.docker.com/get-started

### Opção 2A: Docker Simples

#### 1️⃣ Build da Imagem

```bash
docker build -t carbon-calculator .
```

#### 2️⃣ Executar Container

```bash
docker run -d -p 3000:3000 --name carbon-calculator carbon-calculator
```

#### 3️⃣ Verificar

```bash
docker ps
docker logs carbon-calculator
```

#### 4️⃣ Acessar

```
http://localhost:3000
```

### Opção 2B: Docker Compose (Recomendado)

Inclui: App + Nginx + Redis

#### 1️⃣ Iniciar Todos os Serviços

```bash
docker-compose up -d
```

#### 2️⃣ Verificar Status

```bash
docker-compose ps
```

#### 3️⃣ Ver Logs

```bash
docker-compose logs -f carbon-calculator
```

#### 4️⃣ Acessar

**Com Nginx (porta 80):**
```
http://localhost
```

**Direto na aplicação (porta 3000):**
```
http://localhost:3000
```

### Comandos Úteis Docker

```bash
# Parar containers
docker-compose down

# Rebuild e restart
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Escalar para 3 instâncias
docker-compose up -d --scale carbon-calculator=3
```

---

## 🟣 Método 3: Instalação com Kubernetes

### Pré-requisitos
- ✅ Kubernetes cluster (Minikube, Docker Desktop K8s, ou cloud)
- ✅ kubectl configurado

### Verificar Kubernetes

```bash
kubectl version --client
kubectl cluster-info
```

### Opção 3A: Minikube Local

#### 1️⃣ Instalar Minikube

**Windows (Chocolatey):**
```powershell
choco install minikube
```

**Linux:**
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

**Mac (Homebrew):**
```bash
brew install minikube
```

#### 2️⃣ Iniciar Minikube

```bash
minikube start --driver=docker
```

#### 3️⃣ Build da Imagem (no Minikube)

```bash
eval $(minikube docker-env)
docker build -t carbon-calculator:latest .
```

#### 4️⃣ Deploy

```bash
kubectl apply -f k8s/
```

#### 5️⃣ Verificar

```bash
kubectl get pods
kubectl get services
kubectl get hpa
```

#### 6️⃣ Acessar

```bash
# Obter URL
minikube service carbon-calculator-service --url

# Ou usar port-forward
kubectl port-forward service/carbon-calculator-service 3000:80
```

Acesse: `http://localhost:3000`

### Opção 3B: Cloud Provider (AWS EKS)

#### 1️⃣ Criar Cluster

```bash
eksctl create cluster \
  --name carbon-calculator \
  --region us-east-1 \
  --nodes 3
```

#### 2️⃣ Push da Imagem para ECR

```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag e push
docker tag carbon-calculator:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/carbon-calculator:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/carbon-calculator:latest
```

#### 3️⃣ Atualizar deployment.yaml

Edite `k8s/deployment.yaml` com a imagem do ECR

#### 4️⃣ Deploy

```bash
kubectl apply -f k8s/
```

#### 5️⃣ Obter URL

```bash
kubectl get service carbon-calculator-service
```

Use o EXTERNAL-IP fornecido.

### Comandos Úteis Kubernetes

```bash
# Ver status detalhado
kubectl get all
kubectl describe pod <pod-name>

# Ver logs
kubectl logs -f <pod-name>

# Escalar manualmente
kubectl scale deployment carbon-calculator-deployment --replicas=5

# Ver auto-scaling
kubectl get hpa -w

# Atualizar imagem
kubectl set image deployment/carbon-calculator-deployment carbon-calculator=carbon-calculator:v2

# Rollback
kubectl rollout undo deployment/carbon-calculator-deployment

# Deletar tudo
kubectl delete -f k8s/
```

---

## 🧪 Verificação da Instalação

### Teste 1: Health Check

```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-25T..."
}
```

### Teste 2: Interface Web

Abra: `http://localhost:3000`

Você deve ver:
- ✅ Cabeçalho "Calculadora de Pegada de Carbono"
- ✅ Localização carregada automaticamente
- ✅ Botão "Começar"

### Teste 3: API Geolocalização

```bash
curl http://localhost:3000/api/location
```

### Teste 4: Cálculo Completo

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"kmCarro": 100, "refeicoesCarne": 10, "energiaEletrica": 50, "transporte": 30}'
```

### Teste 5: Scripts Automatizados

**Linux/Mac:**
```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

---

## 🔧 Solução de Problemas

### Problema: "Porta 3000 já está em uso"

**Solução 1 - Mudar porta:**
```env
# Edite o arquivo .env
PORT=3001
```

**Solução 2 - Matar processo:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Problema: "npm install falha"

**Solução:**
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Docker build falha"

**Solução:**
```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker build --no-cache -t carbon-calculator .
```

### Problema: "Kubernetes pods em CrashLoopBackOff"

**Diagnóstico:**
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

**Soluções comuns:**
- Verificar se a imagem está correta
- Verificar secrets configurados
- Verificar resource limits

### Problema: "API de clima não funciona"

**Explicação:**
- A aplicação funciona SEM API key
- Usa dados simulados como fallback
- Para dados reais, configure OPENWEATHER_API_KEY

---

## 📊 Verificar Requisitos Atendidos

Após instalação, verifique:

### ✅ Requisito 1: Front-end
- [ ] Abrir http://localhost:3000
- [ ] Ver interface moderna
- [ ] Preencher formulário
- [ ] Ver resultado

### ✅ Requisito 2-3: APIs
```bash
# Testar geolocalização
curl http://localhost:3000/api/location

# Testar clima
curl http://localhost:3000/api/weather/São%20Paulo
```

### ✅ Requisito 4: Conceitos
- [ ] **Docker**: `docker ps` mostra container rodando
- [ ] **Kubernetes**: `kubectl get pods` mostra pods
- [ ] **Design Patterns**: Ver código em `src/js/config` e `src/js/modules`

---

## 🎯 Próximos Passos

Após a instalação:

1. **Explore a Interface**
   - Calcule sua pegada de carbono
   - Veja as dicas personalizadas

2. **Teste a API**
   - Use o script `./scripts/test-api.sh`
   - Experimente os endpoints

3. **Leia a Documentação**
   - `README.md` - Visão geral
   - `docs/ARQUITETURA.md` - Detalhes técnicos
   - `docs/API.md` - Referência da API

4. **Deploy em Produção**
   - Veja `docs/DEPLOY.md`
   - Configure secrets reais
   - Configure domínio e SSL

---

## 💡 Dicas de Performance

### Desenvolvimento Local
```bash
# Use nodemon para auto-reload
npm run dev
```

### Docker
```bash
# Use build multi-stage para otimização
# (já implementado no Dockerfile)
```

### Kubernetes
```bash
# Configure resource limits apropriados
# Configure HPA para auto-scaling
# (já configurado em k8s/hpa.yaml)
```

---

## 📞 Suporte

### Problemas?

1. **Verifique os logs**
   - Local: Console do terminal
   - Docker: `docker logs carbon-calculator`
   - K8s: `kubectl logs <pod-name>`

2. **Consulte a documentação**
   - README.md
   - docs/
   - Este guia

3. **Issues conhecidos**
   - Porta ocupada: Mude a porta
   - API keys: São opcionais
   - Docker/K8s: Verifique pré-requisitos

---

## ✅ Checklist Final

Após instalação completa:

- [ ] Servidor iniciado sem erros
- [ ] Interface acessível no navegador
- [ ] API respondendo corretamente
- [ ] Geolocalização funcionando
- [ ] Cálculo de CO2 funcionando
- [ ] (Opcional) Docker funcionando
- [ ] (Opcional) Kubernetes funcionando

---

**🎉 Instalação Completa! Comece a usar a Calculadora de Pegada de Carbono!**

Para uso rápido, veja: `QUICKSTART.md`

