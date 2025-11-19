import { Router } from "express";
import { requestCodeController } from "../controllers/auth/requestCode.controller";

export const authRouter = Router();

authRouter.post('/request-code', requestCodeController);