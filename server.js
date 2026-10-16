// Taskly API: a tiny REST service for learning how APIs work.
const express = require("express");
const fs = require("fs");
const path = require("path");

const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data.json");

// --- Storage layer (swap this for a real database later) ---
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return { nextId: 1, tasks: [] };
  }
}
function save(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

const app = express();
app.use(express.json()); // parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // serve the website

// Health check: the simplest possible endpoint
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// READ all tasks. Optional filter: /api/tasks?done=true
app.get("/api/tasks", (req, res) => {
  let { tasks } = load();
  if (req.query.done !== undefined) {
    tasks = tasks.filter((t) => String(t.done) === req.query.done);
  }
  res.json(tasks);
});

// READ one task
app.get("/api/tasks/:id", (req, res) => {
  const task = load().tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// CREATE a task
app.post("/api/tasks", (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const db = load();
  const task = { id: db.nextId++, title, done: false, createdAt: new Date().toISOString() };
  db.tasks.push(task);
  save(db);
  res.status(201).json(task); // 201 = Created
});

// UPDATE a task (title and/or done)
app.patch("/api/tasks/:id", (req, res) => {
  const db = load();
  const task = db.tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (req.body.title !== undefined) {
    const title = String(req.body.title).trim();
    if (!title) return res.status(400).json({ error: "title cannot be empty" });
    task.title = title;
  }
  if (req.body.done !== undefined) task.done = Boolean(req.body.done);
  save(db);
  res.json(task);
});

// DELETE a task
app.delete("/api/tasks/:id", (req, res) => {
  const db = load();
  const index = db.tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  db.tasks.splice(index, 1);
  save(db);
  res.status(204).end(); // 204 = No Content
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Taskly running at http://localhost:${port}`));
}
