import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

export default app;