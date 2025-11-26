#!/bin/bash

echo "☸️  Deploying to Kubernetes..."
echo ""

# Verificar se kubectl está instalado
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl não encontrado. Por favor, instale kubectl"
    exit 1
fi

# Aplicar configurações
echo "📦 Aplicando ConfigMap..."
kubectl apply -f k8s/configmap.yaml

echo "🔐 Aplicando Secrets..."
kubectl apply -f k8s/secrets.yaml

echo "🚀 Aplicando Deployment..."
kubectl apply -f k8s/deployment.yaml

echo "🌐 Aplicando Service..."
kubectl apply -f k8s/service.yaml

echo "📊 Aplicando HPA..."
kubectl apply -f k8s/hpa.yaml

echo "🔀 Aplicando Ingress..."
kubectl apply -f k8s/ingress.yaml

echo ""
echo "✅ Deploy completo!"
echo ""
echo "Verificar status:"
echo "  kubectl get pods"
echo "  kubectl get services"
echo "  kubectl get hpa"
echo ""
echo "Ver logs:"
echo "  kubectl logs -f <pod-name>"

