import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { EmailUtils } from 'src/Common/utils/emil.utils';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService, EmailUtils],
})
export class AnalyticsModule {}
