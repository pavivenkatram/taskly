// Automated API tests using only Node built-ins. Run: npm test
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.DATA_FILE = path.join(os.tmpdir(), `taskly-test-${Date.now()}.json`);
const app = require("./server");

async function call(base, method, url, body) {
  const res = await fetch(base + url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

(async () => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  try {
    let r = await call(base, "GET", "/api/health");
    assert.strictEqual(r.status, 200);

    r = await call(base, "POST", "/api/tasks", { title: "" });
    assert.strictEqual(r.status, 400, "empty title should be rejected");

    r = await call(base, "POST", "/api/tasks", { title: "Learn APIs" });
    assert.strictEqual(r.status, 201);
    const id = r.body.id;

    r = await call(base, "GET", "/api/tasks");
    assert.strictEqual(r.body.length, 1);

    r = await call(base, "PATCH", `/api/tasks/${id}`, { done: true });
    assert.strictEqual(r.body.done, true);

    r = await call(base, "GET", "/api/tasks?done=false");
    assert.strictEqual(r.body.length, 0);

    r = await call(base, "DELETE", `/api/tasks/${id}`);
    assert.strictEqual(r.status, 204);

    r = await call(base, "GET", `/api/tasks/${id}`);
    assert.strictEqual(r.status, 404);

    console.log("All tests passed");
  } finally {
    server.close();
    fs.rmSync(process.env.DATA_FILE, { force: true });
  }
})().catch((e) => {
  console.error("Test failed:", e.message);
  process.exit(1);
});
