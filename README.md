# logiTrack - Dashboard SaaS

Um painel de controle moderno e responsivo focado em logística e rastreamento, construído com as melhores e mais recentes tecnologias do ecossistema React.

## 🔗 Deploy / Produção

O projeto está disponível online e pode ser acessado em modo de produção através do link abaixo:
👉 [**lt-dashboard-six.vercel.app**](https://lt-dashboard-six.vercel.app)

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[React 19](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces.
- **[Vite 8](https://vitejs.dev/)** - Ferramenta de build super rápida.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS Utility-First.
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de interface reutilizáveis construídos sobre Radix UI.
- **[React Router DOM v7](https://reactrouter.com/)** - Gerenciamento de rotas e navegação.
- **[TanStack Query (React Query) v5](https://tanstack.com/query/latest)** - Gerenciamento de estado de servidor, cache e requisições assíncronas.
- **[TanStack Table v8](https://tanstack.com/table/latest)** - Tabelas de dados avançadas, headless e altamente customizáveis.
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado global simples, rápido e escalável.
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** - Criação de formulários performáticos e validação de dados amigável.
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos baseada em React e D3.
- **[Lucide React](https://lucide.dev/)** - Ícones elegantes e consistentes.
- **[Axios](https://axios-http.com/)** - Cliente HTTP baseado em Promises.

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para manter o código escalável, limpo e modular:

```text
src/
├── assets/         # Imagens, fontes e outros recursos estáticos
├── components/     # Componentes globais e reutilizáveis (ex.: MainLayout, LoadingSkeleton)
│   └── ui/         # Componentes base do shadcn/ui
├── contexts/       # React Contexts (ex.: ThemeProvider para dark/light mode)
├── features/       # Módulos isolados e lógicas específicas de funcionalidades (ex.: dashboard)
├── lib/            # Funções utilitárias globais e helpers (ex.: utils.js do Tailwind)
├── pages/          # Páginas renderizadas pelas rotas do React Router
├── services/       # Lógica de integração com APIs e Mockings (ex.: apiMock.js)
├── stores/         # Gerenciamento de estado global com Zustand (ex.: useAppStore.js)
├── App.jsx         # Componente raiz, provimento base e definições de rotas (Lazy loading)
├── index.css       # Estilos globais e configurações do Tailwind
└── main.jsx        # Ponto de entrada principal da aplicação
```

## ✨ Funcionalidades Principais

- **Dashboard:** Visão geral com métricas ágeis e gráficos (`Recharts`).
- **Gestão de Pedidos (Orders):** Listagem de ordens e registros em tabelas eficientes, com alto desempenho utilizando o `TanStack Table`.
- **Rastreamento (Tracking):** Tela dedicada ao acompanhamento logístico.
- **Relatórios (Reports):** Consolidação dos dados para análise do sistema.
- **Configurações (Settings):** Páginas interativas com inputs controlados e validados rigorosamente usando `React Hook Form` e `Zod`.
- **Tema Claro e Escuro (Dark Mode):** Suporte de forma nativa e integrada através da Context API (`ThemeProvider.jsx`).
- **Code-Splitting (Lazy Loading):** Divisão de pacotes nas rotas usando `React.lazy` e `Suspense`. Carregamentos mais rápidos entregando apenas o código da tela necessária no momento.
- **Performance e Caching:** Consultas de dados eficientes com `TanStack Query`, eliminando spinners e refetches excessivos, aliado a simulação de resiliência (retry automático).
- **Mocks Nativos:** O app incorpora uma simulação de camada de serviço com `apiMock.js`, criando um ambiente independente que funciona sem back-end na inicialização do repositório.

## 🛠️ Como Executar o Projeto

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. **Clone do repositório:**
```bash
git clone <url-do-repositorio>
cd "Dashboard SaaS"
```

2. **Instale as dependências:**
Via npm:
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse no navegador:**  
O Vite iniciará o projeto e disponibilizará a rota local, usualmente em `http://localhost:5173`.

## 📦 Scripts Disponíveis

- `npm run dev` - Executa a aplicação em modo de desenvolvimento.
- `npm run build` - Faz o build de produção minificado e otimizado na pasta `dist/`.
- `npm run preview` - Inicia um servidor local simples para realizar um trial em cima do conteúdo otimizado do build.
- `npm run lint` - Analisa o repositório em busca de violações de convenções de código com o `eslint`.

## 🤝 Considerações Finais

O **logiTrack** foi projetado servindo como uma base robusta para plataformas de SaaS ou sistemas B2B, permitindo ser adaptado com extrema facilidade para consumir APIs RESTful usando a instância configurada do `Axios`. A interface foi moldada para ser polida, utilizando animações leves e uma arquitetura limpa de componentes utilizando os padrões modernos do universo React.
