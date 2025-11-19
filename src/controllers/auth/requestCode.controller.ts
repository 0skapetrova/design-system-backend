import { requestCodeService } from "../../services/auth/requestCode.service";
import { Request, Response, NextFunction } from "express";


export function requestCodeController (req: Request, res: Response) {
    try { const result = requestCodeService(req.body.phone);
    res.status(200).json(result) }
    catch (err) {
        throw err;
    };
    
};