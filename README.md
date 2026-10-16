# Taskly: learn APIs, GitHub, agents and MCP by building a product

A tiny task tracker. A **website** talks to an **API**, and the API stores data in a file. Small enough to read in ten minutes, real enough to grow into a product.

## Run it

```bash
npm install
npm start        # http://localhost:3000
npm test         # automated API tests
```

## How the pieces fit

```
Browser (public/index.html)  --HTTP/JSON-->  API (server.js)  -->  data.json
```

- **Website**: shows tasks and sends requests when you click.
- **API**: receives requests, checks them, reads or writes data, replies with JSON.
- **Storage**: a JSON file today. A database later, and only `load()` and `save()` change.

## How APIs work (try these in a terminal while the server runs)

| Action | Method + URL | Success code |
|---|---|---|
| List tasks | `GET /api/tasks` | 200 |
| Get one | `GET /api/tasks/1` | 200 (404 if missing) |
| Create | `POST /api/tasks` with `{"title":"..."}` | 201 (400 if title empty) |
| Update | `PATCH /api/tasks/1` with `{"done":true}` | 200 |
| Delete | `DELETE /api/tasks/1` | 204 |

```bash
curl -X POST localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Try curl"}'
curl localhost:3000/api/tasks
```

Key ideas: the **method** says what you want to do, the **URL** says to which thing, the **status code** says how it went, and the **JSON body** carries the data.

## GitHub basics

1. Create an empty repository on github.com (for example `taskly`).
2. In this folder: `git init`, `git add .`, `git commit -m "First version"`.
3. Connect and push: `git remote add origin <your repo URL>` then `git push -u origin main`.
4. For every new feature: make a **branch**, commit, push, open a **pull request**, review it, merge.

## Improvement roadmap (one small step per pull request)

1. **Due dates and priorities** on tasks (change API, tests, and UI together).
2. **Validation and error handling** (max title length, bad ids).
3. **Swap file storage for SQLite** (only `load`/`save` change; tests prove nothing broke).
4. **User accounts and login** (learn authentication).
5. **Deploy it** so you have a real URL.
6. **Continuous integration**: GitHub Actions runs `npm test` on every pull request.
7. **Add an MCP server** that exposes Taskly's API as tools, so Claude can read and create your tasks.
8. **Build an agent** that triages tasks: reads your list, suggests priorities, and creates follow-ups through the API.

## Words to know

- **API**: a menu of requests a program offers to other programs.
- **Endpoint**: one URL plus method on that menu.
- **Agent**: Claude running in a loop, using tools to finish multi-step work.
- **MCP (Model Context Protocol)**: a standard way to plug tools and data (your API, GitHub, Drive) into Claude.
- **Artifact**: a page or document Claude publishes that you can keep, edit and share.
