# RotaTurApp

Bem-vindo ao RotaTurApp, uma plataforma de gestão e descoberta de rotas turísticas construída com as tecnologias mais modernas de desenvolvimento web.

## 📜 Sobre o Projeto

O RotaTurApp é uma aplicação web pensada para entusiastas de turismo. A plataforma permite que "Publicadores" criem e gerenciem suas próprias rotas turísticas, enquanto "Usuários" podem descobrir, planejar, favoritar e visualizar essas rotas em um mapa interativo. O sistema também conta com um painel de "Administrador" para gerenciamento geral da plataforma.

## 🚀 Tecnologias Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (com App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/)
* **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
* **Mapas:** [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
* **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/)

## ⚙️ Configurando o Projeto Localmente

Siga os passos abaixo para clonar e rodar o projeto em sua máquina. Este guia assume que você já possui um projeto Supabase configurado com as tabelas e políticas de segurança necessárias.

### 1. Pré-requisitos

Antes de começar, você precisará ter instalado:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [pnpm](https://pnpm.io/installation) (para instalar, rode no terminal: `npm install -g pnpm`)
* [Git](https://git-scm.com/)

### 2. Extensões Recomendadas para o VS Code

Para uma melhor experiência de desenvolvimento, recomendo instalar as seguintes extensões no seu Visual Studio Code:

* **ESLint:** `dbaeumer.vscode-eslint` - Ajuda a encontrar e corrigir problemas no código.
* **Prettier - Code formatter:** `esbenp.prettier-vscode` - Formata o código automaticamente para manter um padrão consistente.
* **Tailwind CSS IntelliSense:** `bradlc.vscode-tailwindcss` - Oferece preenchimento automático, realce de sintaxe e linting para o Tailwind CSS.
* **DotENV:** `mikestead.dotenv` - Adiciona realce de sintaxe para arquivos `.env`.

### 3. Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gucordeiro26/RotaTurApp]
    cd RotaTurApp
    ```

2.  **Instale as dependências do projeto:**
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Na raiz do projeto, crie um arquivo chamado `.env.local`.
    * Adicione as chaves do seu projeto Supabase a este arquivo. Você pode encontrá-las em *Project Settings > API* no seu painel do Supabase.

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE_AQUI
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC_AQUI
    ```

### 4. Rodando a Aplicação

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o projeto em ação.

## 📚 Principais Bibliotecas

* `next`: O framework React para produção.
* `react` & `react-dom`: A biblioteca base para a construção da interface.
* `@supabase/supabase-js`: Cliente oficial do Supabase para interagir com o backend (autenticação e banco de dados).
* `tailwindcss`: Framework CSS para estilização rápida e utilitária.
* `shadcn-ui`: Coleção de componentes de UI reutilizáveis, construídos com Radix UI e Tailwind CSS.
* `leaflet` & `react-leaflet`: Bibliotecas para a criação de mapas interativos.
* `lucide-react`: Pacote de ícones utilizado em todo o projeto.
