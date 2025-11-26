#!/bin/bash

echo "🌍 Configurando Calculadora de Pegada de Carbono..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
PORT=3000
OPENWEATHER_API_KEY=
CARBON_INTERFACE_API_KEY=
NODE_ENV=development
EOF
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "Para iniciar o servidor:"
echo "  npm start"
echo ""
echo "Para desenvolvimento com auto-reload:"
echo "  npm run dev"
echo ""
echo "Acesse: http://localhost:3000"

