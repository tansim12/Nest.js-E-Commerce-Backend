import { Module } from '@nestjs/common';
import { CAndSubCService } from './c-and-sub-c.service';
import { CAndSubCController } from './c-and-sub-c.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [CAndSubCController],
  providers: [CAndSubCService, PrismaService],
})
export class CAndSubCModule {}
