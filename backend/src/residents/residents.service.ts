import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateResidentDto } from './dto/create-residents.dto';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: CreateResidentDto) {
    try {
      const resident = await this.prisma.resident.create({
        data: {
          fullName: createResidentDto.fullName,
          data: {
            create: {
              apartment: createResidentDto.apartment,
              pinCode: createResidentDto.pinCode,
            },
          },
        },
        include: {
          data: true,
        },
      });
      return resident;
    } catch (error) {
      console.error('Prisma error:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('Pin code already exists');
      }
      throw new BadRequestException(`Failed to create resident: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const residents = await this.prisma.resident.findMany({
        include: {
          data: true,
        },
      });
      return residents;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new BadRequestException(`Failed to fetch residents: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const resident = await this.prisma.resident.findUnique({
        where: { id },
        include: {
          data: true,
        },
      });
      if (!resident) {
        throw new NotFoundException(`Resident with ID ${id} not found`);
      }
      return resident;
    } catch (error) {
      console.error('Prisma error:', error);
      throw error instanceof NotFoundException ? error : new BadRequestException(`Failed to fetch resident: ${error.message}`);
    }
  }

  async update(id: number, updateResidentDto: CreateResidentDto) {
    try {
      const resident = await this.prisma.resident.update({
        where: { id },
        data: {
          fullName: updateResidentDto.fullName,
          data: {
            update: {
              apartment: updateResidentDto.apartment,
              pinCode: updateResidentDto.pinCode,
            },
          },
        },
        include: {
          data: true,
        },
      });
      return resident;
    } catch (error) {
      console.error('Prisma error:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Resident with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Pin code already exists');
      }
      throw new BadRequestException(`Failed to update resident: ${error.message}`);
    }
  }

  async delete(id: number) {
    try {
      const resident = await this.prisma.resident.delete({
        where: { id },
        include: {
          data: true,
        },
      });
      return resident;
    } catch (error) {
      console.error('Prisma error:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Resident with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to delete resident: ${error.message}`);
    }
  }
}