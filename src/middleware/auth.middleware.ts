import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import AppError from 'src/utils/appError';
import { CustomRequest } from 'src/types/interfaces/user.inter';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = (req.headers as any).authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = await this.authService.verifyToken(token);
        if (decoded) {
          req.user = decoded;
          next();
        } else {
          throw new AppError(
            'Invalid or expired token',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new AppError(
          'Authorization token not found',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(
          new AppError(
            'Your token has expired. Please log in again to get a new token.',
            HttpStatus.UNAUTHORIZED,
          ),
        );
      } else {
        return next(
          new AppError(
            'Invalid token. Please log in again to get a new token.',
            HttpStatus.UNAUTHORIZED,
          ),
        );
      }
    }
  }
}
