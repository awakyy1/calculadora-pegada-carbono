# 🚀 Guia de Deploy

Este guia cobre as diferentes formas de fazer deploy da Calculadora de Pegada de Carbono.

## Índice

1. [Deploy Local](#deploy-local)
2. [Deploy com Docker](#deploy-com-docker)
3. [Deploy com Docker Compose](#deploy-com-docker-compose)
4. [Deploy no Kubernetes](#deploy-no-kubernetes)
5. [Deploy em Cloud Providers](#deploy-em-cloud-providers)

---

## Deploy Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd calculadora-pegada-carbono

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (opcional)
cp .env.example .env
# Edite o arquivo .env com suas API keys

# 4. Inicie o servidor
npm start

# A aplicação estará disponível em:
# http://localhost:3000
```

### Modo Desenvolvimento

```bash
npm run dev
```

Usa `nodemon` para reiniciar automaticamente quando arquivos são modificados.

---

## Deploy com Docker

### Pré-requisitos
- Docker instalado

### Build da Imagem

```bash
# Build da imagem
docker build -t carbon-calculator:latest .

# Verificar imagem criada
docker images | grep carbon-calculator
```

### Executar Container

```bash
# Executar em modo detached
docker run -d \
  --name carbon-calculator \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e OPENWEATHER_API_KEY=sua_chave_aqui \
  carbon-calculator:latest

# Ver logs
docker logs -f carbon-calculator

# Parar container
docker stop carbon-calculator

# Remover container
docker rm carbon-calculator
```

### Com Variáveis de Ambiente

```bash
# Usando arquivo .env
docker run -d \
  --name carbon-calculator \
  -p 3000:3000 \
  --env-file .env \
  carbon-calculator:latest
```

---

## Deploy com Docker Compose

### Pré-requisitos
- Docker Compose instalado

### Configuração

O `docker-compose.yml` inclui:
- **carbon-calculator**: Aplicação principal
- **redis**: Cache (opcional)
- **nginx**: Reverse proxy (opcional)

### Executar

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f carbon-calculator

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### Verificar Saúde

```bash
# Status dos containers
docker-compose ps

# Health check
curl http://localhost:3000/health

# Com nginx (porta 80)
curl http://localhost/health
```

### Escalar Serviços

```bash
# Escalar para 3 instâncias
docker-compose up -d --scale carbon-calculator=3
```

---

## Deploy no Kubernetes

### Pré-requisitos
- Kubernetes cluster (Minikube, EKS, GKE, AKS, etc.)
- kubectl configurado

### 1. Preparar Imagem

```bash
# Build da imagem
docker build -t carbon-calculator:v1.0 .

# Tag para registry (exemplo com Docker Hub)
docker tag carbon-calculator:v1.0 seu-usuario/carbon-calculator:v1.0

# Push para registry
docker push seu-usuario/carbon-calculator:v1.0
```

### 2. Configurar Secrets

Edite `k8s/secrets.yaml` com suas API keys:

```bash
# Criar secret via kubectl (alternativa)
kubectl create secret generic carbon-calculator-secrets \
  --from-literal=openweather-api-key=SUA_CHAVE_AQUI \
  --from-literal=carbon-interface-api-key=SUA_CHAVE_AQUI
```

### 3. Deploy no Cluster

```bash
# Aplicar todas as configurações
kubectl apply -f k8s/

# Ou aplicar individualmente
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Verificar Deploy

```bash
# Ver todos os recursos
kubectl get all

# Ver pods
kubectl get pods
kubectl describe pod <pod-name>

# Ver logs
kubectl logs -f <pod-name>

# Ver serviços
kubectl get services

# Ver HPA
kubectl get hpa

# Ver eventos
kubectl get events --sort-by=.metadata.creationTimestamp
```

### 5. Acessar Aplicação

#### Com LoadBalancer

```bash
# Obter IP externo
kubectl get service carbon-calculator-service

# Acessar
curl http://<EXTERNAL-IP>/health
```

#### Com Port Forward (desenvolvimento)

```bash
# Encaminhar porta local para pod
kubectl port-forward service/carbon-calculator-service 3000:80

# Acessar
curl http://localhost:3000/health
```

#### Com Ingress (produção)

Configure o DNS para apontar para o Ingress:

```bash
# Obter IP do Ingress
kubectl get ingress

# Acessar
curl https://carbon-calculator.example.com
```

### 6. Monitoramento

```bash
# Watch pods em tempo real
kubectl get pods -w

# Métricas de recursos
kubectl top pods
kubectl top nodes

# Ver auto-scaling em ação
kubectl get hpa -w
```

### 7. Updates e Rollbacks

```bash
# Atualizar imagem
kubectl set image deployment/carbon-calculator-deployment \
  carbon-calculator=seu-usuario/carbon-calculator:v1.1

# Ver status do rollout
kubectl rollout status deployment/carbon-calculator-deployment

# Ver histórico
kubectl rollout history deployment/carbon-calculator-deployment

# Rollback para versão anterior
kubectl rollout undo deployment/carbon-calculator-deployment

# Rollback para versão específica
kubectl rollout undo deployment/carbon-calculator-deployment --to-revision=2
```

### 8. Escalar Manualmente

```bash
# Escalar para 5 réplicas
kubectl scale deployment carbon-calculator-deployment --replicas=5

# Verificar
kubectl get pods
```

### 9. Limpar Recursos

```bash
# Deletar todos os recursos
kubectl delete -f k8s/

# Ou deletar namespace inteiro (se usar)
kubectl delete namespace carbon-calculator
```

---

## Deploy em Cloud Providers

### AWS (EKS - Elastic Kubernetes Service)

```bash
# 1. Criar cluster EKS
eksctl create cluster \
  --name carbon-calculator-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3

# 2. Configurar kubectl
aws eks update-kubeconfig --name carbon-calculator-cluster --region us-east-1

# 3. Deploy
kubectl apply -f k8s/

# 4. Verificar LoadBalancer
kubectl get service carbon-calculator-service
```

### Google Cloud (GKE)

```bash
# 1. Criar cluster GKE
gcloud container clusters create carbon-calculator-cluster \
  --num-nodes=3 \
  --machine-type=e2-medium \
  --zone=us-central1-a

# 2. Configurar kubectl
gcloud container clusters get-credentials carbon-calculator-cluster \
  --zone=us-central1-a

# 3. Deploy
kubectl apply -f k8s/
```

### Azure (AKS)

```bash
# 1. Criar cluster AKS
az aks create \
  --resource-group myResourceGroup \
  --name carbon-calculator-cluster \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2

# 2. Configurar kubectl
az aks get-credentials \
  --resource-group myResourceGroup \
  --name carbon-calculator-cluster

# 3. Deploy
kubectl apply -f k8s/
```

### DigitalOcean Kubernetes

```bash
# 1. Criar cluster via UI ou API

# 2. Download kubeconfig
doctl kubernetes cluster kubeconfig save <cluster-id>

# 3. Deploy
kubectl apply -f k8s/
```

### Heroku (Container)

```bash
# 1. Login
heroku login
heroku container:login

# 2. Criar app
heroku create carbon-calculator-app

# 3. Push container
heroku container:push web --app carbon-calculator-app

# 4. Release
heroku container:release web --app carbon-calculator-app

# 5. Abrir
heroku open --app carbon-calculator-app
```

---

## Variáveis de Ambiente

### Obrigatórias
- `PORT` - Porta do servidor (padrão: 3000)
- `NODE_ENV` - Ambiente (development/production)

### Opcionais
- `OPENWEATHER_API_KEY` - Chave da API OpenWeather
- `CARBON_INTERFACE_API_KEY` - Chave da API Carbon Interface

### Configuração

#### Docker
```bash
docker run -e NODE_ENV=production -e PORT=3000 ...
```

#### Kubernetes
Edite `k8s/secrets.yaml` e `k8s/configmap.yaml`

#### Heroku
```bash
heroku config:set NODE_ENV=production
heroku config:set OPENWEATHER_API_KEY=sua_chave
```

---

## SSL/TLS

### Let's Encrypt (Kubernetes)

```bash
# 1. Instalar cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 2. Criar ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: seu-email@exemplo.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# 3. O Ingress já está configurado para usar SSL
```

---

## CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t carbon-calculator:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push carbon-calculator:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/carbon-calculator-deployment \
            carbon-calculator=carbon-calculator:${{ github.sha }}
```

---

## Troubleshooting

### Container não inicia

```bash
# Ver logs
docker logs carbon-calculator

# Entrar no container
docker exec -it carbon-calculator sh
```

### Pod em CrashLoopBackOff

```bash
# Ver logs
kubectl logs <pod-name>

# Descrever pod
kubectl describe pod <pod-name>

# Ver eventos
kubectl get events --sort-by=.metadata.creationTimestamp
```

### LoadBalancer pendente

```bash
# Verificar se cloud provider suporta LoadBalancer
# Usar NodePort como alternativa:
kubectl patch service carbon-calculator-service -p '{"spec":{"type":"NodePort"}}'
```

---

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Secrets criados
- [ ] Imagem Docker testada localmente
- [ ] Deployment aplicado
- [ ] Service criado
- [ ] Health checks funcionando
- [ ] HPA configurado
- [ ] Ingress configurado (se necessário)
- [ ] SSL/TLS configurado
- [ ] Monitoramento configurado
- [ ] Logs acessíveis
- [ ] Backup configurado

---

## Suporte

Para problemas de deploy:
1. Verifique os logs
2. Confirme configurações
3. Teste localmente primeiro
4. Consulte documentação do provider
5. Abra uma issue no repositório


