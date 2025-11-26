# 🚂 Deploy na Railway.app - Guia Completo

## 🎯 Por Que Railway?

- ✅ **Gratuito**: 500 horas/mês
- ✅ **Fácil**: Deploy em 2 minutos
- ✅ **Docker Nativo**: Detecta Dockerfile automaticamente
- ✅ **HTTPS Grátis**: SSL automático
- ✅ **Deploy Automático**: Push no GitHub = Deploy automático

---

## 📋 Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta no Railway.app (gratuita)
3. Seu código no GitHub

---

## 🚀 Passo a Passo - Deploy em 5 Minutos

### 1️⃣ Criar Repositório no GitHub

```bash
# No seu terminal (dentro da pasta do projeto)
git init
git add .
git commit -m "Initial commit - Calculadora Pegada de Carbono"
```

**Depois:**
1. Vá para https://github.com
2. Clique em "New repository"
3. Nome: `calculadora-pegada-carbono`
4. Deixe **público** ou **privado**
5. Clique em "Create repository"

**Conectar local com GitHub:**
```bash
git remote add origin https://github.com/SEU-USUARIO/calculadora-pegada-carbono.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub (recomendado)
4. Autorize o Railway a acessar seus repositórios

---

### 3️⃣ Deploy do Projeto

1. No Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: `calculadora-pegada-carbono`
4. Railway vai **detectar o Dockerfile automaticamente**
5. Clique em **"Deploy Now"**

🎉 **Pronto!** O Railway vai:
- Detectar o `Dockerfile`
- Fazer build da imagem Docker
- Fazer deploy automático
- Gerar uma URL pública (ex: `https://seu-app.up.railway.app`)

---

### 4️⃣ Configurar Variáveis de Ambiente

**No painel do Railway:**

1. Clique no seu projeto
2. Vá em **"Variables"**
3. Adicione as seguintes variáveis:

```env
PORT=3000
NODE_ENV=production
OPENWEATHER_API_KEY=146f92a8656aa0b3996755ddfa0ae720
```

4. Clique em **"Add"** para cada variável
5. O Railway vai fazer **redeploy automático**

---

### 5️⃣ Acessar Sua Aplicação

1. No painel do Railway, vá em **"Settings"**
2. Procure por **"Domains"**
3. Clique em **"Generate Domain"**
4. Copie a URL gerada (ex: `https://calculadora-carbono.up.railway.app`)
5. **Pronto!** Seu app está no ar! 🎉

---

## 📊 Monitoramento

### Ver Logs em Tempo Real:
1. No Railway, clique em **"Deployments"**
2. Clique no deployment ativo
3. Veja os logs ao vivo

### Verificar Health:
Acesse: `https://seu-app.up.railway.app/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-11-26T..."
}
```

---

## 🔄 Deploy Automático

**Configurado automaticamente!**

Toda vez que você fizer:
```bash
git add .
git commit -m "Sua mensagem"
git push
```

O Railway vai:
1. Detectar o push
2. Fazer rebuild da imagem Docker
3. Deploy automático
4. Zero downtime

---

## 💰 Limites do Plano Gratuito

- **500 horas/mês** de runtime
- **1 GB RAM**
- **1 GB storage**
- **100 GB bandwidth**

**Suficiente para:**
- ✅ Projetos acadêmicos
- ✅ Portfólio
- ✅ Demonstrações
- ✅ Testes

---

## 🐛 Troubleshooting

### Build falhou?
1. Verifique os logs no Railway
2. Certifique-se que o `Dockerfile` está correto
3. Verifique se o `package.json` está commitado

### App não inicia?
1. Verifique se a variável `PORT` está configurada
2. Veja os logs de runtime
3. Teste o health check: `/health`

### API do OpenWeather não funciona?
1. Verifique se `OPENWEATHER_API_KEY` está nas variáveis
2. Aguarde 10-15 min se a chave for nova
3. O app usa fallback automático com dados simulados

---

## 🎨 Domínio Personalizado (Opcional)

**Se você tiver um domínio próprio:**

1. No Railway, vá em **"Settings" > "Domains"**
2. Clique em **"Custom Domain"**
3. Digite seu domínio: `calculadora.seudominio.com`
4. Configure o DNS (Railway mostra as instruções)
5. Aguarde propagação (até 24h)

---

## 📱 Testar na Prática

### URL de Exemplo:
```
https://calculadora-carbono.up.railway.app
```

### Endpoints Disponíveis:
- `GET /` - Página inicial
- `GET /health` - Health check
- `GET /api/location` - Geolocalização
- `GET /api/weather/:city` - Clima
- `POST /api/calculate` - Calcular pegada

---

## 🔒 Segurança

Railway já inclui:
- ✅ HTTPS automático (SSL/TLS)
- ✅ Proteção DDoS
- ✅ Isolamento de containers
- ✅ Variáveis de ambiente seguras

---

## 📈 Próximos Passos

Depois do deploy:

1. ✅ Teste todas as funcionalidades
2. ✅ Compartilhe a URL com professores
3. ✅ Adicione a URL no README.md
4. ✅ Coloque no seu portfólio

---

## 🎓 Para Apresentação

**Mostre ao professor:**

1. 📱 **App funcionando** na URL do Railway
2. 🐳 **Dockerfile** no código
3. 📊 **Painel do Railway** com logs
4. 🌐 **APIs reais** funcionando (geolocalização + clima)
5. 🏗️ **Arquitetura** Docker em produção

---

## 🆘 Precisa de Ajuda?

- **Documentação Railway**: https://docs.railway.app
- **Discord Railway**: https://discord.gg/railway
- **Status**: https://status.railway.app

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Conta criada no Railway
- [ ] Projeto conectado ao repositório
- [ ] Variáveis de ambiente configuradas
- [ ] Domain gerado
- [ ] App funcionando na URL
- [ ] Health check OK
- [ ] APIs testadas

---

**🎉 Pronto! Seu projeto está em produção com Docker no Railway!**

Deploy time: **~5 minutos** ⚡

Agora você tem:
- ✅ App online 24/7
- ✅ URL pública para compartilhar
- ✅ Deploy automático
- ✅ HTTPS gratuito
- ✅ Logs em tempo real
- ✅ Zero custo

**Sucesso no projeto!** 🚀

