import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaClient,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: never, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')?.[1];

    const tokenPayload = this.jwtService.decode(token) as { id: number };

    if (tokenPayload) {
      const userId = tokenPayload.id;

      if (userId) {
        const user = await this.prismaService.user.findUnique({
          where: { id: userId },
        });

        req.auth = user;
      }
    }

    next();
  }
}
