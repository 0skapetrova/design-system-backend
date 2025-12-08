import { Router } from 'express';

export const router = Router();

import './auth.routes';
import { authRouter } from './auth.routes';

router.use('/auth', authRouter);
