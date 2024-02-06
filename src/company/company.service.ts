import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaClient) {}

  findOne(id: number) {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  async addCompany(name: string, creatorId: number) {
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name,
        },
      });

      const userCompanies = await tx.userCompany.create({
        data: {
          user: {
            connect: {
              id: creatorId,
            },
          },
          company: {
            connect: {
              id: company.id,
            },
          },
          isManager: true,
        },
      });

      return userCompanies;
    });
  }

  findCompanyOffices(companyId: number) {
    return this.prisma.office.findMany({
      where: {
        companyId,
      },
    });
  }

  findCompanyUsers(companyId: number) {
    return this.prisma.user.findMany({
      where: {
        UserCompanys: {
          every: {
            companyId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  findUserCompanies(userId: number) {
    return this.prisma.company.findMany({
      where: {
        UserCompanys: {
          every: {
            userId,
          },
        },
      },
    });
  }

  async deleteCompany(companyId: number) {
    const userCompanies = await this.prisma.userCompany.findMany({
      where: {
        companyId,
      },
    });

    if (userCompanies.length) {
      throw new BadRequestException(
        "Can't delete this company because it has users",
      );
    }

    return this.prisma.company.delete({
      where: { id: companyId },
    });
  }
}
