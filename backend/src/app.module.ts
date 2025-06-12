import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ResidentsModule } from './residents/residents.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, ResidentsModule],
  providers: [PrismaService],
})
export class AppModule {}