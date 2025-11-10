import http from 'http';

const server = http.createServer((req, res) => {
    if (req.url === '/ping' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true}));
    }
});

server.listen(3000)