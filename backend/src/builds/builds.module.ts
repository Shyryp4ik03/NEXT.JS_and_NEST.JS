import { Module } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { BuildsController } from './builds.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BuildsController],
  providers: [BuildsService, PrismaService],
})
export class BuildsModule {}