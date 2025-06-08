import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBuildDto } from './dto/create-build.dto';

@Injectable()
export class BuildsService {
  constructor(private prisma: PrismaService) {}

  async create(createBuildDto: CreateBuildDto) {
    try {
      console.log('Received DTO:', createBuildDto);
      const build = await this.prisma.build.create({
        data: {
          name: createBuildDto.name,
          security_level: createBuildDto.securityLevel,
          floor: createBuildDto.floors,
          last_check: new Date(createBuildDto.lastInspection),
        },
      });
      return build;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new BadRequestException(`Failed to create building: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const builds = await this.prisma.build.findMany();
      return builds;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new BadRequestException(`Failed to fetch buildings: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const build = await this.prisma.build.findUnique({
        where: { id },
      });
      if (!build) {
        throw new NotFoundException(`Building with ID ${id} not found`);
      }
      return build;
    } catch (error) {
      console.error('Prisma error:', error);
      throw error instanceof NotFoundException ? error : new BadRequestException(`Failed to fetch building: ${error.message}`);
    }
  }

  async update(id: number, updateBuildDto: CreateBuildDto) {
    try {
      const build = await this.prisma.build.update({
        where: { id },
        data: {
          name: updateBuildDto.name,
          security_level: updateBuildDto.securityLevel,
          floor: updateBuildDto.floors,
          last_check: new Date(updateBuildDto.lastInspection),
        },
      });
      return build;
    } catch (error) {
      console.error('Prisma error:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Building with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to update building: ${error.message}`);
    }
  }

  async delete(id: number) {
    try {
      const build = await this.prisma.build.delete({
        where: { id },
      });
      return build;
    } catch (error) {
      console.error('Prisma error:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Building with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to delete building: ${error.message}`);
    }
  }
}