import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';

@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('/my-companies')
  getMyCompanies(@Auth() user: User) {
    console.log('requested');
    return this.companyService.findUserCompanies(user.id);
  }

  @Get('/:id')
  getCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Post('/')
  addCompany(@Body() body: CreateCompanyDto, @Auth() user: User) {
    return this.companyService.addCompany(body.name, user.id);
  }

  @Get('/:id/offices')
  getCompanyOffices(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findCompanyOffices(id);
  }

  @Get('/:id/users')
  getCompanyUsers(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findCompanyUsers(id);
  }

  @Delete('/:id')
  deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.deleteCompany(id);
  }
}
