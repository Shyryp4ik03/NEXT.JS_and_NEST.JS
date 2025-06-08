import { Controller, Post, Get, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/builds')
@UseGuards(AuthGuard('jwt'))
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBuildDto: CreateBuildDto) {
    return this.buildsService.create(createBuildDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.buildsService.findAll();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBuildDto: CreateBuildDto) {
    return this.buildsService.update(id, updateBuildDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.buildsService.delete(id);
  }
}