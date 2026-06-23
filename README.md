# 📚 Projeto Biblioteca

Sistema **fullstack** de gerenciamento de biblioteca com controle de catálogo de livros e empréstimos, com dois perfis de acesso: **bibliotecário** e **leitor**.

---

## 📋 Sobre o Projeto

O **Projeto Biblioteca** permite que leitores consultem o catálogo de livros disponíveis e solicitem empréstimos, enquanto bibliotecários gerenciam o acervo e controlam o ciclo de vida dos empréstimos (aprovação de devoluções, histórico, etc). O controle de estoque é automático: a quantidade disponível de cada livro é atualizada a cada empréstimo, devolução ou cancelamento.

A autenticação é feita via **JWT**, com autorização baseada no perfil do usuário (`bibliotecario` ou `leitor`).

---

## 🗂️ Estrutura do Monorepo

```
Projeto_Biblioteca/
├── Back/      # Backend — Node.js, Express, MySQL
└── Front/     # Frontend — React, Vite, Tailwind CSS
```

---

## 🔧 Backend — API REST

### Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | — | Runtime (ESM, `type: module`) |
| Express | ^5.2 | Servidor HTTP |
| MySQL2 | ^3.22 | Driver de conexão com MySQL |
| JWT (jsonwebtoken) | ^9.0 | Autenticação com tokens |
| bcryptjs | ^3.0 | Hash de senhas |
| Zod | ^4.4 | Validação de dados |
| dotenv | ^17.4 | Variáveis de ambiente |
| cors | ^2.8 | Liberação de requisições cross-origin |

### Estrutura da API

```
Back/
├── src/
│   ├── server.js                          # Inicialização do Express (porta 3000)
│   ├── controllers/
│   │   ├── usuarios-controller.js         # Cadastro e login
│   │   ├── livros-controller.js           # CRUD de livros
│   │   └── emprestimos-controller.js      # Empréstimos e devoluções
│   ├── database/
│   │   ├── db.js                          # Conexão MySQL via mysql2
│   │   └── schema.sql                     # Script de criação das tabelas + dados iniciais
│   ├── middlewares/
│   │   ├── autentificacaoToken.js         # Verifica o JWT e popula req.usuario
│   │   ├── autorizacaoPerfil.js           # Restringe rotas por perfil (bibliotecario/leitor)
│   │   └── CapturadorError.js             # Tratamento global de erros (AppError + ZodError)
│   ├── routes/
│   │   ├── index.js
│   │   ├── usuario-routes.js
│   │   ├── livros-routes.js
│   │   └── emprestimo-routes.js
│   └── utils/
│       └── AppError.js                    # Classe de erros personalizados
└── package.json
```

### Banco de Dados (MySQL)

```
usuario
├── id            Int       (PK, auto-increment)
├── nome          Varchar(150)
├── email         Varchar(150)
├── senha         Varchar(100)   (hash bcrypt)
└── perfil        Enum('bibliotecario', 'leitor')

livro
├── id                       Int       (PK, auto-increment)
├── titulo                   Varchar(150)
├── autor                    Varchar(150)
├── ano_publicacao           Int
└── quantidade_disponivel    Int

emprestimo
├── id                        Int    (PK, auto-increment)
├── livro_id                  Int    (FK → livro.id)
├── leitor_id                 Int    (FK → usuario.id)
├── data_emprestimo           Date
├── data_devolucao_prevista   Date   (sempre +30 dias da data do empréstimo)
├── data_devolucao_real       Date   (null até a devolução ser confirmada)
└── status                    Enum('ativo', 'devolvido', 'atrasado', 'pendente')
```

> O arquivo `schema.sql` já inclui o `CREATE DATABASE biblioteca`, a criação das três tabelas e **dados de exemplo**: 8 livros e 8 empréstimos em diferentes status (ativo, devolvido, atrasado, pendente) — útil para testar o sistema imediatamente após configurar o banco.

### 🔄 Fluxo de Status do Empréstimo

```
ativo  →  atrasado          (automático, quando passa da data prevista sem devolução)
ativo  →  pendente          (leitor solicita devolução)
pendente  →  devolvido      (bibliotecário confirma a devolução)
```

> A verificação de atraso é feita a cada listagem: o backend roda um `UPDATE` que marca como `atrasado` todo empréstimo `ativo` cuja `data_devolucao_prevista` já passou.

### 👤 Perfis de Usuário

| Perfil | Permissões |
|---|---|
| **Leitor** | Consultar catálogo, criar empréstimo, ver seus próprios empréstimos, solicitar devolução |
| **Bibliotecário** | Consultar catálogo, criar/editar/excluir livros, listar todos os empréstimos, confirmar devolução, cancelar empréstimo |

---

## 🔌 Rotas da API

### Usuário — `/usuario`

| Método | Rota | Descrição | Auth | Body |
|---|---|---|---|---|
| `POST` | `/usuario/cadastro` | Criar conta | ❌ | `{ nome, email, senha (mín. 6), perfil: "bibliotecario" \| "leitor" }` |
| `POST` | `/usuario/login` | Login / gerar token JWT | ❌ | `{ email, senha }` |

### Livros — `/livro`

| Método | Rota | Descrição | Auth | Perfil |
|---|---|---|---|---|
| `GET` | `/livro/listar` | Listar todos os livros | ✅ JWT | qualquer |
| `GET` | `/livro/buscar/:id` | Buscar livro por ID | ✅ JWT | qualquer |
| `POST` | `/livro/criar` | Cadastrar novo livro | ✅ JWT | `bibliotecario` |
| `PUT` | `/livro/atualizar/:id` | Atualizar livro | ✅ JWT | `bibliotecario` |
| `DELETE` | `/livro/deletar/:id` | Remover livro | ✅ JWT | `bibliotecario` |

> Body de criação/atualização: `{ titulo, autor, ano_publicacao: number, quantidade_disponivel: number }`. O sistema impede cadastro duplicado (mesmo título + autor).

### Empréstimos — `/emprestimo`

| Método | Rota | Descrição | Auth | Perfil |
|---|---|---|---|---|
| `POST` | `/emprestimo/criar` | Criar empréstimo | ✅ JWT | `leitor` |
| `GET` | `/emprestimo/emprestimos-leitor` | Listar empréstimos do leitor logado | ✅ JWT | `leitor` |
| `PATCH` | `/emprestimo/:id/solicitar-devolucao` | Solicitar devolução (marca como `pendente`) | ✅ JWT | `leitor` |
| `GET` | `/emprestimo/listar` | Listar todos os empréstimos | ✅ JWT | `bibliotecario` |
| `PATCH` | `/emprestimo/:id/devolucao` | Confirmar devolução (marca como `devolvido`) | ✅ JWT | `bibliotecario` |
| `DELETE` | `/emprestimo/deletar/:id` | Cancelar empréstimo | ✅ JWT | `bibliotecario` |

> Body de criação: `{ livro_id: number }`. O `leitor_id` é extraído automaticamente do token JWT (`req.usuario.id`), não é enviado pelo cliente.

> Ao criar um empréstimo, a `quantidade_disponivel` do livro é decrementada automaticamente. Ao confirmar a devolução ou cancelar um empréstimo ativo/pendente/atrasado, a quantidade é restaurada (+1).

#### Exemplo de Response — `POST /usuario/login`

```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "perfil": "leitor"
  }
}
```

### Como Rodar a API

**1. Instale as dependências:**
```bash
cd Back
npm install
```

**2. Crie o banco de dados:**

Execute o script `src/database/schema.sql` no seu cliente MySQL (Workbench, DBeaver, linha de comando, etc). Ele cria o banco `biblioteca`, as tabelas e já popula com dados de exemplo.

```bash
mysql -u seu_usuario -p < src/database/schema.sql
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na pasta `Back/`:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=biblioteca
DB_PORT=3306
JWT_SECRET=sua_chave_secreta_aqui
```

**4. Inicie o servidor:**
```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

---

## 🖥️ Frontend — SPA React

### Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | ^19.2 | Biblioteca de UI |
| Vite | ^8.0 | Bundler e dev server |
| Tailwind CSS | ^4.3 | Estilização utilitária |
| React Router | ^7.17 | Roteamento |
| Axios | ^1.17 | Requisições HTTP |
| Zod | ^4.4 | Validação de formulários |
| Lucide React | ^1.18 | Ícones |

### Estrutura do Frontend

```
Front/
├── src/
│   ├── App.jsx                       # Raiz: AuthProvider + AppRoutes
│   ├── main.jsx                      # Entry point
│   ├── index.css                     # Estilos globais Tailwind
│   ├── components/
│   │   ├── AppLayout.jsx             # Layout autenticado (Header + Outlet)
│   │   ├── AuthLayout.jsx            # Layout de login/cadastro
│   │   ├── Header.jsx                # Navegação + saudação + logout
│   │   ├── Button.jsx                # Botão reutilizável (temas, tamanhos, loading)
│   │   ├── Input.jsx                 # Campo de input com legenda
│   │   ├── Select.jsx                # Select com legenda
│   │   ├── Loading.jsx               # Tela de carregamento
│   │   ├── LivroCard.jsx             # Card de livro no catálogo
│   │   ├── EmprestimoCard.jsx        # Card de empréstimo
│   │   ├── ModalCriarLivro.jsx       # Modal de cadastro de livro (bibliotecário)
│   │   ├── ModalEditarLivro.jsx      # Modal de edição de livro (bibliotecário)
│   │   ├── ModalDetalhesLivro.jsx    # Modal de visualização do livro
│   │   └── ModalVisualizarEmprestimo.jsx  # Modal de detalhes/ações do empréstimo
│   ├── contexts/
│   │   └── AuthContext.jsx           # Contexto global de sessão (JWT + localStorage)
│   ├── hooks/
│   │   └── useAuth.jsx               # Hook para consumir o AuthContext
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Cadastrar.jsx
│   │   ├── Catalogo.jsx              # Listagem e gestão de livros
│   │   ├── Emprestimos.jsx           # Listagem e gestão de empréstimos
│   │   └── NotFound.jsx
│   ├── routes/
│   │   ├── index.jsx                 # Detecta o perfil e escolhe o conjunto de rotas
│   │   ├── LogarRoutes.jsx           # Rotas públicas (login, cadastro)
│   │   ├── LeitorRoutes.jsx          # Rotas do leitor
│   │   └── BibliotecarioRoutes.jsx   # Rotas do bibliotecário
│   └── services/
│       └── api.js                    # Instância Axios (injeta JWT automaticamente)
└── vite.config.js
```

### Fluxo de Autenticação

O `AuthContext` gerencia a sessão via **localStorage** (chave `@biblioteca`):
- `@biblioteca:usuario` — dados do usuário logado
- `@biblioteca:token` — JWT

O serviço `api.js` injeta o token automaticamente em todas as requisições via interceptor do Axios.

### Roteamento por Perfil

```
Não autenticado  →  LogarRoutes          →  /            (Login)
                                             /cadastrar   (Cadastrar)

leitor           →  LeitorRoutes         →  /            (Catálogo)
                                             /emprestimos (Meus Empréstimos)

bibliotecario    →  BibliotecarioRoutes  →  /            (Catálogo — com botões de gestão)
                                             /emprestimos (Painel de Empréstimos)
```

> A mesma tela de **Catálogo** se adapta conforme o perfil: bibliotecários veem botões de editar/excluir/adicionar livro, enquanto leitores veem o botão "Gerar Empréstimo".

### Como Rodar o Frontend

**1. Instale as dependências:**
```bash
cd Front
npm install
```

**2. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na pasta `Front/`:
```env
VITE_BACK_URL=http://localhost:3000
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

---

## 🚀 Rodando o Projeto Completo

```bash
# Terminal 1 — Backend
cd Back
npm install
mysql -u seu_usuario -p < src/database/schema.sql
# configure o .env (ver seção acima)
npm run dev

# Terminal 2 — Frontend
cd Front
npm install
# configure o .env (ver seção acima)
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📁 Scripts Disponíveis

### Backend (`/Back`)
| Script | Comando | Descrição |
|---|---|---|
| `dev` | `node --watch src/server.js` | Servidor com hot reload nativo do Node |

### Frontend (`/Front`)
| Script | Comando | Descrição |
|---|---|---|
| `dev` | `vite` | Dev server com HMR |
| `build` | `vite build` | Build de produção |
| `preview` | `vite preview` | Preview do build |

---

## 🔒 Segurança

- Senhas armazenadas com **bcryptjs** (salt rounds: 8)
- Autenticação via **JWT** com expiração de 1 dia
- Autorização por perfil (`autorizacaoPerfil`) protegendo rotas sensíveis (criação/edição de livros, gestão de empréstimos)
- Validação de entrada em todos os endpoints com **Zod**
- Variáveis sensíveis (`DB_PASSWORD`, `JWT_SECRET`) isoladas em `.env`, ignorado pelo `.gitignore`

---

## 👥 Autores

- **Luiz Miguel** — [@Luiz-Miguel-Pimenta](https://github.com/Luiz-Miguel-Pimenta)
- **Alef Davi** — [@paulodaniell](https://github.com/paulodaniell)
- **Paulo Daniel** — [@alefdavialves](https://github.com/alefdavialves)
