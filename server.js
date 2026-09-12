const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000; 

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        const html = fs.readFileSync(path.join(__dirname, "index.html"));
        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
        });
        res.end(html);
        return;
    }

    if (req.url === "/heartbeat" && req.method === "GET") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const timestamp = Date.now();

        res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        });
        res.end(JSON.stringify({ timestamp }));
        return;
    }

    res.writeHead(404);
    res.end("Not found");
});

server.listen(port, () => {
    console.log(`Heartbeat monitor: http://localhost:${port}`);
});
