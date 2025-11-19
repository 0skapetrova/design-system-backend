import express from 'express';
import { loggerMiddleware } from './middlewares';

const app = express();

app.use(loggerMiddleware)
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

export default app;