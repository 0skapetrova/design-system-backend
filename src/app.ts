import express from 'express';
import { loggerMiddleware } from './middlewares';
import { router } from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(loggerMiddleware)
app.use(express.json());
app.use('/api', router);

app.get('/api/ping', (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

app.use(errorMiddleware);
export default app;