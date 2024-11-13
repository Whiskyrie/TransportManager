import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const filePath = join(process.cwd(), req.url);
        console.log('Tentando acessar:', filePath); // Log para debug
        if (req.url.startsWith('/uploads/')) {
            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Erro ao enviar arquivo:', err);
                    next();
                }
            });
        }
        next();
    }
}