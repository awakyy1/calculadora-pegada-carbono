# Calculadora de Pegada de Carbono - ODS 13

Protótipo simples de uma calculadora de pegada de carbono relacionada ao ODS 13 (Ação Contra a Mudança Global do Clima).

## Como usar

### Opção 1: Abrir diretamente no navegador (Mais Simples)
1. Duplo clique no arquivo `index.html` para abrir no navegador
2. Ou execute no terminal: `bun run open`
3. Ou execute diretamente: `Invoke-Item index.html`

### Opção 2: Servidor HTTP Local
Escolha uma das opções abaixo:

**Com Python:**
```bash
bun run start
# ou
python -m http.server 3000
```

**Com Node.js:**
```bash
bun run serve
# ou
npx http-server -p 3000 -o
```

Depois acesse: http://localhost:3000

## Estrutura dos Arquivos

- `index.html` - Estrutura HTML e JavaScript
- `styles.css` - Estilos visuais do protótipo
- `package.json` - Configuração do projeto
- `README.md` - Documentação

## Funcionalidades

- **Tela Inicial**: Apresentação do sistema com botão "Começar"
- **Tela de Formulário**: Coleta de dados do usuário:
  - Quilômetros percorridos de carro por semana
  - Número de refeições com carne por semana
- **Tela de Resultado**: Mostra a estimativa de emissão de CO₂ e dicas para redução

## Cálculo

Fórmula utilizada (fictícia para fins de protótipo):
```
CO₂ semanal = (km de carro × 0,2) + (refeições com carne × 2)
```

## Características Visuais

- **Design Moderno**: Interface com gradientes, animações suaves e efeitos visuais
- **Responsivo**: Adaptável a diferentes tamanhos de tela (desktop, tablet, mobile)
- **Interativo**: Botões com efeitos hover, animações e feedback visual
- **Tipografia Premium**: Fonte Google Fonts (Poppins) para melhor legibilidade
- **Ícones Visuais**: Emojis para identificação rápida de funcionalidades

## Funcionalidades Técnicas

- Navegação entre telas sem recarregamento da página
- Animações suaves de transição entre telas
- Validação inteligente com notificações personalizadas
- Efeito de loading durante cálculos
- Feedback visual em tempo real
- Suporte a navegação por teclado (Enter)
