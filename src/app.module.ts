import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from './Common/Config/configuration';
// import { JwtModule } from '@nestjs/jwt';
import { CAndSubCModule } from './c-and-sub-c/c-and-sub-c.module';
import { ShopModule } from './shop/shop.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // এটি অ্যাপের প্রতিটি জায়গায় কনফিগ ব্যবহার করতে দিবে
      load: [configuration], // আপনার কনফিগ লোড হবে
      cache: true,
    }),
    // JwtModule.register({}),
    ConfigModule,
    AuthModule,
    UserModule,
    CAndSubCModule,
    ShopModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
