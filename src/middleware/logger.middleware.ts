import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;
    
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const statusCode = res.statusCode;
      const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} ${responseTime}ms\n`;
      
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }
    
      fs.appendFile(
        path.join(logDir, 'api.log'),
        logMessage,
        (err) => {
          if (err) {
            console.error('Error writing to log file', err);
          }
        }
      );
      
      console.log(logMessage);
    });
    
    next();
  }
}
