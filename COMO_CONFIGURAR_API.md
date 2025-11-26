# 🌤️ Como Configurar a API do OpenWeather (GRATUITO)

## ⚡ Passo a Passo Rápido (5 minutos)

### 1. Criar Conta no OpenWeather (Gratuito)

**👉 Acesse:** https://openweathermap.org/api

Clique em **"Sign Up"** (Cadastrar)

Preencha:
- Nome
- Email
- Senha
- Aceite os termos

✅ **É 100% GRATUITO!** (1.000 chamadas por dia grátis)

---

### 2. Confirmar Email

📧 Você vai receber um email de confirmação.

Clique no link para ativar sua conta.

---

### 3. Pegar sua API Key

Após fazer login:

1. Clique no seu nome (canto superior direito)
2. Clique em **"My API keys"**
3. Você verá uma chave padrão já criada
4. **Copie a chave** (exemplo: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

⚠️ **Importante:** A chave pode levar **alguns minutos** (até 2 horas) para ser ativada!

---

### 4. Configurar no Projeto

**Opção A: Editar arquivo .env**

Abra o arquivo `.env` na raiz do projeto e cole sua chave:

```env
OPENWEATHER_API_KEY=sua_chave_aqui_colada
```

**Opção B: Usar o script automático**

Windows:
```powershell
.\scripts\configure-api.bat
```

Linux/Mac:
```bash
./scripts/configure-api.sh
```

---

### 5. Reiniciar o Servidor

**Pare o servidor** (Ctrl+C no terminal)

**Inicie novamente:**
```bash
npm start
```

---

## ✅ Verificar se Funcionou

Após reiniciar, recarregue a página.

Você verá:
- ✅ **Clima real** (sem o badge "simulado")
- 🌡️ **Temperatura real** da sua cidade
- ☁️ **Condição climática real**

---

## 🚨 Problemas Comuns

### "Clima ainda aparece como simulado"

**Soluções:**
1. ✅ Confirme que a API key está no arquivo `.env`
2. ✅ Verifique se **NÃO** tem espaços extras antes/depois da chave
3. ✅ Espere alguns minutos - a chave pode não estar ativa ainda
4. ✅ **REINICIE o servidor** (npm start)
5. ✅ Limpe o cache do navegador (Ctrl+Shift+R)

### "Erro 401 Unauthorized"

- Sua API key ainda não foi ativada
- Espere 10-15 minutos e tente novamente

### "Erro 429 Too Many Requests"

- Você excedeu o limite gratuito (1.000/dia)
- Espere até amanhã ou faça upgrade

---

## 📊 Planos do OpenWeather

| Plano | Preço | Chamadas/dia | Para este projeto |
|-------|-------|--------------|-------------------|
| **Free** | R$ 0 | 1.000 | ✅ **SUFICIENTE** |
| Startup | $40/mês | 100.000 | ⚠️ Desnecessário |
| Developer | $150/mês | 1.000.000 | ⚠️ Desnecessário |

💡 **O plano gratuito é mais que suficiente para este projeto!**

---

## 🎯 Verificar Status da API

Teste sua API key manualmente:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=São Paulo&appid=SUA_CHAVE&units=metric&lang=pt_br"
```

Resposta esperada:
```json
{
  "name": "São Paulo",
  "main": {
    "temp": 24.5
  },
  "weather": [...]
}
```

---

## 💡 Dica Pro

Se você não quer se cadastrar agora, o sistema **já funciona com dados simulados** bem realistas!

Os dados simulados incluem:
- ✅ São Paulo: 24°C - Parcialmente nublado
- ✅ Rio de Janeiro: 28°C - Ensolarado
- ✅ Brasília: 26°C - Céu limpo
- ✅ Outras cidades: 25°C - Clima agradável

**Para demonstração e testes, os dados simulados são perfeitamente adequados!**

---

## 📞 Suporte

Problemas? Verifique:
1. `.env` tem a chave correta
2. Servidor foi reiniciado
3. API key está ativa (espere 10-15 min após cadastro)
4. Não tem espaços extras na chave

---

**🎉 Pronto! Agora você tem dados climáticos reais!**

