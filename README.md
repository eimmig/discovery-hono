# CRUD básico com Hono + Netlify Edge Functions

Este projeto implementa uma API REST simples de tarefas usando:

- Hono
- Netlify Edge Functions
- Armazenamento em memória (Map)

## O que a API faz

A API permite operações CRUD em tarefas:

- Criar tarefa
- Listar tarefas
- Buscar tarefa por ID
- Atualizar tarefa
- Remover tarefa

Cada tarefa possui o formato:

```json
{
  "id": "uuid",
  "title": "Estudar Hono",
  "done": false,
  "createdAt": "2026-03-31T12:00:00.000Z",
  "updatedAt": "2026-03-31T12:00:00.000Z"
}
```
## Passo a passo: do zero até aqui

Se voce quer reproduzir exatamente o caminho para chegar neste projeto, siga este roteiro.

### 1) Criar o projeto base

Use o scaffold do Hono e escolha Netlify como runtime/deploy target.

```bash
npx create-hono@latest crud-test
```

Depois entre na pasta:

```bash
cd crud-test
```

### 2) Configurar roteamento da Edge Function

No arquivo `netlify.toml`, configure todas as rotas para a edge function `index`:

```toml
[[edge_functions]]
  function = "index"
  path = "/*"
```

### 3) Implementar a API

No arquivo `netlify/edge-functions/index.ts`:

- criar app com Hono
- declarar estrutura de tarefa (id, title, done, createdAt, updatedAt)
- manter dados em memoria com `Map`
- criar rotas REST:
  - `GET /`
  - `GET /tasks`
  - `GET /tasks/:id`
  - `POST /tasks`
  - `PUT /tasks/:id`
  - `DELETE /tasks/:id`

### 4) Preparar dependencias

Garantir que exista `package.json` com:

- dependencia `hono`
- script `dev` apontando para Netlify CLI

Instalar dependencias:

```bash
npm install
```

### 5) Subir localmente

```bash
npm run dev
```

Por padrao, sobe em:

- `http://localhost:8888`

### 6) Testar local

Criar tarefa:

```bash
curl -X POST http://localhost:8888/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Primeira tarefa","done":false}'
```

Listar:

```bash
curl http://localhost:8888/tasks
```

Atualizar:

```bash
curl -X PUT http://localhost:8888/tasks/SEU_ID \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

Remover:

```bash
curl -X DELETE http://localhost:8888/tasks/SEU_ID
```

## Como rodar localmente (resumo rapido)

1. `npm install`
2. `npm run dev`
3. acessar `http://localhost:8888`

## Como funciona internamente

Arquivos principais:

- `netlify/edge-functions/index.ts`
- `netlify/edge-functions/lib/react-pages.ts`
- `netlify/edge-functions/lib/task-service.ts`
- `netlify/edge-functions/lib/http-utils.ts`
- `netlify.toml`

Organizacao:

- `index.ts`: define as rotas e orquestra chamadas
- `lib/react-pages.ts`: centraliza HTML das paginas React de demonstracao
- `lib/task-service.ts`: concentra regras de CRUD e armazenamento em memoria
- `lib/http-utils.ts`: funcoes de parse/validacao de request

Fluxo:

1. O Netlify roteia qualquer caminho para a Edge Function.
2. O Hono faz o matching da rota e executa o handler.
3. O CRUD opera em um `Map` na memoria do processo.
4. A resposta volta em JSON com codigos HTTP adequados (200, 201, 404, 422).

## Deploy na Netlify para testar online

Voce tem duas formas: via CLI (rapida) ou via GitHub (recomendada para fluxo continuo).

### Opcao A: Deploy via Netlify CLI

1. Instalar CLI (global, opcional):

```bash
npm install -g netlify-cli
```

2. Login na conta Netlify:

```bash
netlify login
```

3. Na raiz do projeto, vincular/criar site:

```bash
netlify init
```

4. Deploy de preview:

```bash
netlify deploy
```

5. Deploy de producao:

```bash
netlify deploy --prod
```

A URL final sera exibida no terminal (ex.: `https://seu-site.netlify.app`).

### Opcao B: Deploy via GitHub (CI/CD)

1. Subir projeto para um repositorio no GitHub.
2. Na Netlify, clicar em Add new site > Import an existing project.
3. Conectar o repositorio.
4. Confirmar configuracoes de build (para este caso, pode manter sem comando de build).
5. Finalizar o deploy.

Depois disso, cada push na branch configurada faz novo deploy automaticamente.

## Endpoints

Base URL local:

- `http://localhost:8888`

Base URL em producao:

- `https://SEU-SITE.netlify.app`

### `GET /`

Retorna pagina HTML com React (home da demo).

### `GET /react/tasks`

Retorna pagina HTML com React consumindo `GET /tasks`.

### `GET /api`

Retorna metadados em JSON com as rotas da aplicacao.

### `GET /tasks`

Lista todas as tarefas.

### `GET /tasks/:id`

Busca uma tarefa por ID.

### `POST /tasks`

Cria nova tarefa.

Body JSON:

```json
{
  "title": "Minha tarefa",
  "done": false
}
```

### `PUT /tasks/:id`

Atualiza `title` e/ou `done`.

Body JSON (exemplo):

```json
{
  "title": "Tarefa atualizada",
  "done": true
}
```

### `DELETE /tasks/:id`

Remove tarefa por ID.