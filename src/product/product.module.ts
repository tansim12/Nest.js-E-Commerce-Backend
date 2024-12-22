import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
