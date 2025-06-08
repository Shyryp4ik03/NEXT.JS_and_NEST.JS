import { Module } from '@nestjs/common';
import { BuildsModule } from './builds/builds.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [BuildsModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}