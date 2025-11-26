#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testando API..."
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""

# Test 2: Geolocalização
echo "2️⃣  Testing Geolocation API..."
curl -s "$BASE_URL/api/location" | jq '.'
echo ""

# Test 3: Clima
echo "3️⃣  Testing Weather API..."
curl -s "$BASE_URL/api/weather/São%20Paulo" | jq '.'
echo ""

# Test 4: Cálculo de Carbono
echo "4️⃣  Testing Carbon Calculator..."
curl -s -X POST "$BASE_URL/api/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "kmCarro": 100,
    "refeicoesCarne": 10,
    "energiaEletrica": 50,
    "transporte": 30,
    "country": "BR"
  }' | jq '.'
echo ""

# Test 5: Fatores de Emissão
echo "5️⃣  Testing Emission Factors..."
curl -s "$BASE_URL/api/emission-factors/BR" | jq '.'
echo ""

echo "✅ Testes concluídos!"

