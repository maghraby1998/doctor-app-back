import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) {}

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async findUserCompany(userId: number) {
    return (
      await this.prisma.userCompany.findMany({
        where: {
          userId: { equals: userId },
        },
        orderBy: {
          id: 'desc',
        },
      })
    )[0];
  }
}
