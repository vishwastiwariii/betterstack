import type {Request, Response, NextFunction} from "express"
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
    userId: string 
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization !

    try {
        let data = jwt.verify(token, process.env.JWT_SECRET!) 
        req.userId = data.sub as string 
        next()
    } catch (error) {
        console.log(error);
        res.status(403).send("");
    }
}