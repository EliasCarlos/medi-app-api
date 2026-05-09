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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'List all doctors' })
  @ApiOkResponse({ description: 'Return all doctors', type: [DoctorEntity] })
  async findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  @ApiOkResponse({ description: 'Return doctor details', type: DoctorEntity })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Patch(':id')
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
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete doctor' })
  @ApiNoContentResponse({ description: 'Doctor deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.doctorsService.delete(id);
  }
}
