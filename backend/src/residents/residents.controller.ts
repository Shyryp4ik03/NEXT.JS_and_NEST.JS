import { Controller, Post, Get, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-residents.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/residents')
@UseGuards(AuthGuard('jwt'))
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResidentDto: CreateResidentDto) {
    return this.residentsService.create(createResidentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.residentsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.residentsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateResidentDto: CreateResidentDto) {
    return this.residentsService.update(id, updateResidentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.residentsService.delete(id);
  }
}