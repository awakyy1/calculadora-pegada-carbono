@echo off
echo 🌍 Configurando Calculadora de Pegada de Carbono...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js 18+
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

REM Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    (
        echo PORT=3000
        echo OPENWEATHER_API_KEY=
        echo CARBON_INTERFACE_API_KEY=
        echo NODE_ENV=development
    ) > .env
    echo ✅ Arquivo .env criado
) else (
    echo ✅ Arquivo .env já existe
)

echo.
echo ✅ Setup completo!
echo.
echo Para iniciar o servidor:
echo   npm start
echo.
echo Para desenvolvimento com auto-reload:
echo   npm run dev
echo.
echo Acesse: http://localhost:3000
pause

