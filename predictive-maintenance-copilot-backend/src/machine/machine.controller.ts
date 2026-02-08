import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import {
  CreateMachineDto,
  UpdateMachineDto,
  QueryMachinesDto,
} from './dto/machine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('machines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.operator)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machineService.create(createMachineDto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.operator, UserRole.viewer)
  findAll(@Query() query: QueryMachinesDto) {
    return this.machineService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.operator, UserRole.viewer)
  findOne(@Param('id') id: string) {
    return this.machineService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.admin, UserRole.operator, UserRole.viewer)
  getStats(@Param('id') id: string) {
    return this.machineService.getStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.operator)
  update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    return this.machineService.update(id, updateMachineDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.machineService.remove(id);
  }
}
