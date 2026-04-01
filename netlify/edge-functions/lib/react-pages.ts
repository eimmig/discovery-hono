const HOME_SCRIPT = `
const App = () => {
  return React.createElement('main', { className: 'card' }, [
    React.createElement('p', { key: 'tag', className: 'tag' }, 'Demo Hono + React'),
    React.createElement('h1', { key: 'h1' }, 'Hono servindo pagina React'),
    React.createElement(
      'p',
      { key: 'p1', className: 'muted' },
      'Esta pagina foi retornada por uma rota do Hono e renderizada com React no cliente.'
    ),
    React.createElement('div', { key: 'actions', className: 'actions' }, [
      React.createElement('a', { key: 'a1', href: '/react/tasks', className: 'btn primary' }, 'Abrir pagina de tarefas'),
      React.createElement('a', { key: 'a2', href: '/api', className: 'btn ghost' }, 'Ver metadados da API')
    ]),
    React.createElement('p', { key: 'raw', className: 'muted small' }, [
      'Endpoint cru: ',
      React.createElement('a', { key: 'a3', href: '/tasks' }, 'GET /tasks')
    ])
  ])
}

createRoot(document.getElementById('root')).render(React.createElement(App))
`

const TASKS_SCRIPT = `
const App = () => {
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data.data) ? data.data : []))
      .finally(() => setLoading(false))
  }, [])

  const content = []

  if (loading) {
    content.push(React.createElement('p', { key: 'loading', className: 'muted' }, 'Carregando tarefas...'))
  } else if (tasks.length === 0) {
    content.push(React.createElement('p', { key: 'empty', className: 'muted' }, 'Nenhuma tarefa encontrada.'))
  } else {
    content.push(
      React.createElement(
        'ul',
        { key: 'list', className: 'list' },
        tasks.map((task) =>
          React.createElement(
            'li',
            { key: task.id, className: 'item' },
            [
              React.createElement('span', { key: 'title' }, task.title),
              React.createElement(
                'span',
                { key: 'status', className: task.done ? 'status ok' : 'status pending' },
                task.done ? 'Concluida' : 'Pendente'
              )
            ]
          )
        )
      )
    )
  }

  return React.createElement('main', { className: 'card' }, [
    React.createElement('p', { key: 'tag', className: 'tag' }, 'Lista consumindo GET /tasks'),
    React.createElement('h1', { key: 'h1' }, 'Pagina React de tarefas'),
    React.createElement('p', { key: 'p1', className: 'muted' }, 'Crie tarefas via POST /tasks e recarregue esta pagina.'),
    React.createElement('p', { key: 'p2', className: 'small' }, React.createElement('a', { href: '/' }, 'Voltar para home')),
    ...content
  ])
}

createRoot(document.getElementById('root')).render(React.createElement(App))
`

const renderReactPage = (title: string, script: string) => {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        --bg: #f4f6f8;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #475569;
        --line: #e2e8f0;
        --primary: #0f766e;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 28px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at 100% 0%, #d1fae5 0%, transparent 30%),
          radial-gradient(circle at 0% 100%, #e0f2fe 0%, transparent 35%),
          var(--bg);
      }

      .card {
        max-width: 860px;
        margin: 0 auto;
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
      }

      .tag {
        margin: 0 0 8px;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--primary);
      }

      h1 {
        margin: 0 0 10px;
        font-size: 30px;
        line-height: 1.15;
      }

      a {
        color: var(--primary);
      }

      .muted {
        color: var(--muted);
      }

      .small {
        font-size: 14px;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 18px 0 14px;
      }

      .btn {
        display: inline-block;
        text-decoration: none;
        border-radius: 10px;
        padding: 10px 14px;
        border: 1px solid var(--line);
        transition: transform 0.12s ease, box-shadow 0.12s ease;
      }

      .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 14px rgba(15, 23, 42, 0.08);
      }

      .btn.primary {
        border-color: var(--primary);
        background: var(--primary);
        color: #fff;
      }

      .btn.ghost {
        background: #fff;
      }

      .list {
        list-style: none;
        padding: 0;
        margin: 16px 0 0;
        display: grid;
        gap: 10px;
      }

      .item {
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .status {
        font-size: 12px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 999px;
      }

      .status.ok {
        color: #065f46;
        background: #d1fae5;
      }

      .status.pending {
        color: #7c2d12;
        background: #ffedd5;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import React from 'https://esm.sh/react@18.3.1'
      import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client'

      ${script}
    </script>
  </body>
</html>`
}

export const homePageHtml = () => renderReactPage('Hono + React Demo', HOME_SCRIPT)

export const tasksPageHtml = () => renderReactPage('Lista de tarefas', TASKS_SCRIPT)
