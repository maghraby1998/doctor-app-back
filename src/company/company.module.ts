import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaClient],
})
export class CompanyModule {
  constructor(private prisma: PrismaClient) {}
}
