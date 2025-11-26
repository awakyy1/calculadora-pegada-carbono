@echo off
echo.
echo ========================================
echo CONFIGURAR API DO OPENWEATHER
echo ========================================
echo.
echo Este script vai ajudar voce a configurar a API key.
echo.
echo Voce JA tem uma API key do OpenWeather?
echo.
echo 1. Sim, eu tenho a chave
echo 2. Nao, preciso criar uma conta (gratuito)
echo.
choice /C 12 /N /M "Digite 1 ou 2: "

if errorlevel 2 goto cadastrar
if errorlevel 1 goto configurar

:cadastrar
echo.
echo ========================================
echo CRIAR CONTA NO OPENWEATHER (GRATUITO)
echo ========================================
echo.
echo 1. Abrindo navegador em: https://openweathermap.org/api
start https://openweathermap.org/api
echo.
echo 2. Clique em "Sign Up"
echo 3. Preencha o formulario (nome, email, senha)
echo 4. Confirme o email que voce vai receber
echo 5. Faca login e va em "My API keys"
echo 6. Copie sua API key
echo.
echo Aperte qualquer tecla quando tiver a chave...
pause >nul
goto configurar

:configurar
echo.
echo ========================================
echo COLAR SUA API KEY
echo ========================================
echo.
echo Cole sua API key do OpenWeather:
echo (Exemplo: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6)
echo.
set /p APIKEY="API KEY: "

if "%APIKEY%"=="" (
    echo.
    echo [ERRO] Voce nao digitou nenhuma chave!
    echo.
    pause
    exit /b 1
)

echo.
echo Configurando...

REM Criar/atualizar arquivo .env
(
    echo PORT=3000
    echo NODE_ENV=development
    echo.
    echo # OpenWeather API Key - Configurada em %date% %time%
    echo OPENWEATHER_API_KEY=%APIKEY%
    echo.
    echo # Opcional - Carbon Interface API
    echo CARBON_INTERFACE_API_KEY=
) > .env

echo.
echo ========================================
echo CONFIGURACAO COMPLETA!
echo ========================================
echo.
echo [OK] API key salva em .env
echo [OK] OpenWeather configurado!
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Reinicie o servidor:
echo    - Pressione Ctrl+C no terminal do servidor
echo    - Digite: npm start
echo.
echo 2. Recarregue a pagina no navegador
echo.
echo 3. Aguarde 10-15 minutos se a chave foi recem-criada
echo.
echo Voce vera o clima REAL da sua cidade!
echo.
pause

