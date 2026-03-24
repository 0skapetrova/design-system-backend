import { authMeService } from "../../services/auth/authMe.service";
import { Request, Response, NextFunction } from "express";

export async function authMeController (req: Request, res: Response) {
    try {const user = await(authMeService())
    res.status(200).json(user); }
    catch (err) {
        throw err;
    };
};