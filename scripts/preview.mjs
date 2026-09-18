import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};
http
  .createServer((req, res) => {
    let name;
    try {
      name = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      ).replace(/^\/planer-nauki(?=\/|$)/, "");
    } catch {
      res.writeHead(400).end();
      return;
    }
    let file = path.resolve(root, `.${name || "/"}`);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(path.join(root, "404.html")));
      return;
    }
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    fs.createReadStream(file).pipe(res);
  })
  .listen(3000, "127.0.0.1", () =>
    console.log("Preview: http://127.0.0.1:3000/planer-nauki/en/"),
  );
