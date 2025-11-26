# 📝 Comandos Git - Enviar para GitHub

## 🚀 Passo a Passo Rápido

### 1️⃣ Inicializar Git (se ainda não iniciou)
```bash
git init
```

### 2️⃣ Adicionar todos os arquivos
```bash
git add .
```

### 3️⃣ Fazer o primeiro commit
```bash
git commit -m "Projeto completo - Calculadora Pegada de Carbono"
```

### 4️⃣ Criar repositório no GitHub

**Opção A - Pela interface:**
1. Acesse: https://github.com/new
2. Nome do repositório: `calculadora-pegada-carbono`
3. Deixe público ou privado
4. **NÃO** marque "Add README"
5. Clique em "Create repository"

**Opção B - Pelo terminal (mais rápido):**
Se você tem GitHub CLI instalado:
```bash
gh repo create calculadora-pegada-carbono --public --source=. --remote=origin --push
```

### 5️⃣ Conectar com o repositório remoto (Opção A)
```bash
# Substitua SEU-USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU-USUARIO/calculadora-pegada-carbono.git
```

### 6️⃣ Renomear branch para main
```bash
git branch -M main
```

### 7️⃣ Enviar para o GitHub
```bash
git push -u origin main
```

---

## ✅ Verificar se deu certo

Acesse: `https://github.com/SEU-USUARIO/calculadora-pegada-carbono`

Você deve ver todos os arquivos lá!

---

## 🔄 Próximos Pushes (depois do primeiro)

```bash
git add .
git commit -m "Sua mensagem de atualização"
git push
```

---

## 🚂 Depois do GitHub → Railway

1. Acesse: https://railway.app
2. Faça login com GitHub
3. New Project → Deploy from GitHub repo
4. Escolha `calculadora-pegada-carbono`
5. Railway detecta o Dockerfile automaticamente
6. Deploy! 🎉

**Deploy time:** ~2-3 minutos

Sua URL será algo como:
```
https://calculadora-carbono-production.up.railway.app
```

---

## 💡 Dica Pro

**Configurar variáveis no Railway ANTES do deploy:**

No painel do Railway:
- Variables → Add Variable
- `OPENWEATHER_API_KEY` = `146f92a8656aa0b3996755ddfa0ae720`
- `NODE_ENV` = `production`
- `PORT` = `3000`

---

## 🆘 Problemas Comuns

### "Permission denied"
```bash
# Use HTTPS ao invés de SSH
git remote set-url origin https://github.com/SEU-USUARIO/calculadora-pegada-carbono.git
```

### "Already exists"
```bash
# Se o repositório já existe
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/calculadora-pegada-carbono.git
git push -u origin main --force
```

### "Large files"
```bash
# Se arquivos muito grandes (node_modules)
# Verifique se .gitignore está funcionando
cat .gitignore
```

---

**Pronto para fazer deploy!** 🚀

