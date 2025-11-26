#!/bin/bash

echo "🐳 Building Docker image..."
echo ""

# Build da imagem
docker build -t carbon-calculator:latest .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Imagem construída com sucesso!"
    echo ""
    echo "Para executar:"
    echo "  docker run -p 3000:3000 carbon-calculator:latest"
    echo ""
    echo "Ou use Docker Compose:"
    echo "  docker-compose up -d"
else
    echo ""
    echo "❌ Erro ao construir imagem"
    exit 1
fi

