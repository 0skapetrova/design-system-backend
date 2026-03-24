import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './middlewares';
import { router } from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { setupSwagger } from './openapi/swagger-ui';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(loggerMiddleware)
app.use(express.json());
setupSwagger(app);
app.use('/api', router);

app.get('/api/ping', (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

app.use(errorMiddleware);
export default app;