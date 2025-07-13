# 🎰 Roleta de Pokémon - Scarlet & Violet

Um aplicativo interativo de roleta que permite descobrir Pokémon aleatórios dos jogos Pokémon Scarlet & Violet, incluindo as DLCs Teal Mask e Indigo Disk.

## ✨ Características

- **🎲 Roleta Interativa**: Gire a roleta para descobrir Pokémon aleatórios
- **📱 Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **✨ Sistema Shiny**: 10% de chance de encontrar Pokémon Shiny
- **🎨 Interface Moderna**: Design com gradientes e animações suaves
- **📊 Estatísticas Detalhadas**: Visualize HP, Ataque, Defesa e outras stats
- **🏷️ Tipos Coloridos**: Badges coloridos para cada tipo de Pokémon
- **💾 Cache Inteligente**: Dados dos Pokémon são armazenados em cache para melhor performance

## 🎮 Pokémon Incluídos

- **Paldea (Scarlet/Violet)**: IDs 906-1010
- **Kitakami (Teal Mask DLC)**: IDs 1011-1025
- **Blueberry Academy (Indigo Disk DLC)**: IDs 1026-1045

## 🚀 Como Usar

1. **Instalar dependências**:

   ```bash
   npm install
   ```

2. **Executar em desenvolvimento**:

   ```bash
   npm run dev
   ```

3. **Construir para produção**:

   ```bash
   npm run build
   ```

4. **Visualizar build de produção**:
   ```bash
   npm run preview
   ```

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP para API
- **CSS3** - Estilos modernos com gradientes e animações

## 🌐 API Utilizada

O aplicativo utiliza a [PokéAPI](https://pokeapi.co/), uma API pública e gratuita que fornece dados completos sobre todos os Pokémon.

## 📱 Funcionalidades

### Interface Principal

- Botão de roleta com animação de rotação
- Contador de Pokémon disponíveis
- Loading spinner durante o carregamento

### Card do Pokémon

- Imagem oficial do Pokémon (com suporte a Shiny)
- Nome formatado e ID
- Badges de tipo com cores oficiais
- Informações de altura e peso
- Gráfico de barras para estatísticas
- Lista de habilidades (incluindo ocultas)

### Sistema Shiny

- 10% de chance de encontrar Pokémon Shiny
- Badge especial ✨ para Pokémon Shiny
- Imagem Shiny quando disponível

## 🎨 Design

- **Gradiente de fundo**: Roxo para azul
- **Glassmorphism**: Cards com efeito de vidro
- **Animações**: Transições suaves e efeitos hover
- **Responsivo**: Adaptado para todos os tamanhos de tela
- **Cores oficiais**: Tipos de Pokémon com cores oficiais

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── PokemonRoulette.tsx    # Componente principal
│   └── PokemonRoulette.css    # Estilos da roleta
├── services/
│   └── pokemonApi.ts          # Serviço da API
├── types/
│   └── pokemon.ts             # Tipos TypeScript
├── App.tsx                    # Componente raiz
└── main.tsx                   # Ponto de entrada
```

## 🌍 Deploy Online

Para fazer o deploy online, você pode usar:

- **Vercel**: `vercel --prod`
- **Netlify**: Conecte seu repositório GitHub
- **GitHub Pages**: Use o GitHub Actions
- **Firebase Hosting**: `firebase deploy`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [PokéAPI](https://pokeapi.co/) pela API gratuita
- [Nintendo](https://www.nintendo.com/) e [Game Freak](https://www.gamefreak.co.jp/) pelos jogos Pokémon
- Comunidade Pokémon por manter o interesse na franquia

---

**Divirta-se descobrindo Pokémon! 🎮✨**
