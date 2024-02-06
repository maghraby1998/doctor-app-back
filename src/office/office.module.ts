import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { PrismaClient } from '@prisma/client';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [OfficeController],
  providers: [OfficeService, PrismaClient],
})
export class OfficeModule {}
