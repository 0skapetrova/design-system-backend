import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors/HttpError";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        console.error("HttpError", err);
        return res.status(err.status).json({
            error: err.error,
            message: err.message,
            details: err.details,
        });
    }
    console.error("Unexpected Error:", err);
    return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Сервисная ошибка",
        details: null,
    });
}
