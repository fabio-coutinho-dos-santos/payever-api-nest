import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

    constructor(private readonly jwtService: JwtService){}

    use(req: Request, res: Response, next: NextFunction) {
    
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try{
            this.jwtService.verify(token, {secret: process.env.JWT_SECRET_KEY})
        }catch(e){
            res.status(401).send({
                statusCode: 401,
                maessage: "Invalid token",
                error: "Unauthorized"
              })
        }
    }
    next();
  }
}