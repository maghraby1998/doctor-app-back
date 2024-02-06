import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OfficeService } from './office.service';
import { User } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateOfficeDto } from './dto/create-office.dto';

@Controller('offices')
export class OfficeController {
  constructor(private officeService: OfficeService) {}

  @Get()
  getOffices(@Auth() user: User) {
    return this.officeService.getOffices(user.id);
  }

  @Get('/:id')
  getOffice(@Param('id', ParseIntPipe) id: number) {
    return this.officeService.getOffice(id);
  }

  @Post()
  createOffice(@Body() input: CreateOfficeDto, @Auth() user: User) {
    return this.officeService.createOffice(input, user.id);
  }
}
