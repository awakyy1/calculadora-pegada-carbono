#!/bin/bash

echo ""
echo "========================================"
echo "CONFIGURAR API DO OPENWEATHER"
echo "========================================"
echo ""
echo "Este script vai ajudar você a configurar a API key."
echo ""
echo "Você JÁ tem uma API key do OpenWeather?"
echo ""
echo "1. Sim, eu tenho a chave"
echo "2. Não, preciso criar uma conta (gratuito)"
echo ""
read -p "Digite 1 ou 2: " choice

if [ "$choice" == "2" ]; then
    echo ""
    echo "========================================"
    echo "CRIAR CONTA NO OPENWEATHER (GRATUITO)"
    echo "========================================"
    echo ""
    echo "1. Abrindo navegador em: https://openweathermap.org/api"
    
    # Detectar sistema operacional e abrir navegador
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://openweathermap.org/api"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "https://openweathermap.org/api" 2>/dev/null || echo "Abra manualmente: https://openweathermap.org/api"
    fi
    
    echo ""
    echo "2. Clique em 'Sign Up'"
    echo "3. Preencha o formulário (nome, email, senha)"
    echo "4. Confirme o email que você vai receber"
    echo "5. Faça login e vá em 'My API keys'"
    echo "6. Copie sua API key"
    echo ""
    read -p "Pressione Enter quando tiver a chave..."
fi

echo ""
echo "========================================"
echo "COLAR SUA API KEY"
echo "========================================"
echo ""
echo "Cole sua API key do OpenWeather:"
echo "(Exemplo: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6)"
echo ""
read -p "API KEY: " APIKEY

if [ -z "$APIKEY" ]; then
    echo ""
    echo "[ERRO] Você não digitou nenhuma chave!"
    echo ""
    exit 1
fi

echo ""
echo "Configurando..."

# Criar/atualizar arquivo .env
cat > .env << EOF
PORT=3000
NODE_ENV=development

# OpenWeather API Key - Configurada em $(date)
OPENWEATHER_API_KEY=$APIKEY

# Opcional - Carbon Interface API
CARBON_INTERFACE_API_KEY=
EOF

echo ""
echo "========================================"
echo "CONFIGURAÇÃO COMPLETA!"
echo "========================================"
echo ""
echo "[OK] API key salva em .env"
echo "[OK] OpenWeather configurado!"
echo ""
echo "PRÓXIMOS PASSOS:"
echo ""
echo "1. Reinicie o servidor:"
echo "   - Pressione Ctrl+C no terminal do servidor"
echo "   - Digite: npm start"
echo ""
echo "2. Recarregue a página no navegador"
echo ""
echo "3. Aguarde 10-15 minutos se a chave foi recém-criada"
echo ""
echo "Você verá o clima REAL da sua cidade!"
echo ""

