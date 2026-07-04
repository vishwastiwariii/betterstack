import type {Request, Response, NextFunction} from "express"
import jwt, { type JwtPayload } from 'jsonwebtoken'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization!

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        req.userId = data.sub
        next()
    } catch (error) {
        console.log(error);
        res.status(403).send("");
    }
}