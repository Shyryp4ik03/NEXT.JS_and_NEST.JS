import { Module } from '@nestjs/common';
import { ResidentsController } from './residents.controller';
import { ResidentsService } from './residents.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ResidentsController],
  providers: [ResidentsService, PrismaService],
})
export class ResidentsModule {}