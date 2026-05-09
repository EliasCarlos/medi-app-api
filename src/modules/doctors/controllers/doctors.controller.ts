import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { DoctorEntity } from '../entities/doctor.entity';
import { DoctorsService } from '../services/doctors.service';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new doctor' })
  @ApiCreatedResponse({
    description: 'Doctor registered successfully',
    type: DoctorEntity,
  })
  async create(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<DoctorEntity> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all doctors' })
  @ApiOkResponse({ description: 'Return all doctors', type: [DoctorEntity] })
  async findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PATIENT, Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get doctor by ID' })
  @ApiOkResponse({ description: 'Return doctor details', type: DoctorEntity })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor profile' })
  @ApiOkResponse({
    description: 'Doctor updated successfully',
    type: DoctorEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete doctor' })
  @ApiNoContentResponse({ description: 'Doctor deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.doctorsService.delete(id);
  }
}
