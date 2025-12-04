import { Router } from "express";
import { requestCodeController } from "../controllers/auth/requestCode.controller";
import { authMeController } from "../controllers/auth/authMe.controller";

export const authRouter = Router();

authRouter.post('/request-code', requestCodeController);

authRouter.get('/me', authMeController)