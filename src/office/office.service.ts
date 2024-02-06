import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OfficeService {
  constructor(
    private prisma: PrismaClient,
    private userService: UserService,
  ) {}

  getOffice(id: number) {
    return this.prisma.office.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        weekends: true,
      },
    });
  }

  async getOffices(authId: number) {
    const companyId = (await this.userService.findUserCompany(authId))
      .companyId;

    return this.prisma.office.findMany({
      where: {
        companyId,
      },
    });
  }

  async createOffice(createOfficeInput: CreateOfficeDto, creatorId: number) {
    return this.prisma.$transaction(async (tx) => {
      const creatorCompanyId = (
        await this.userService.findUserCompany(creatorId)
      ).companyId;

      const office = await tx.office.create({
        data: {
          name: createOfficeInput.name,
          company: {
            connect: {
              id: creatorCompanyId,
            },
          },
          weekends: 'weekends',
        },
      });

      const workHourConfig = await this.prisma.workHourConfiguration.create({
        data: {
          start: createOfficeInput.start,
          end: createOfficeInput.end,
          office: {
            connect: {
              id: office.id,
            },
          },
          estimatedAppointmentTimeAsMinutes:
            createOfficeInput.estimatedAppointmentTime,
        },
      });

      return workHourConfig;
    });
  }

  async deleteOffice(officeId: number) {
    const userOffices = await this.prisma.userOffice.findMany({
      where: {
        officeId,
      },
    });

    if (userOffices.length) {
      throw new BadRequestException(
        "can't delete this office because it has users",
      );
    }

    return this.prisma.office.delete({
      where: {
        id: officeId,
      },
    });
  }

  async companyOfficesList(companyId: number) {
    return this.prisma.office.findMany({
      where: {
        companyId,
      },
    });
  }
}
