import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [ShopController],
  providers: [ShopService, PrismaService],
})
export class ShopModule {}
