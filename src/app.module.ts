import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './Common/Config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // এটি অ্যাপের প্রতিটি জায়গায় কনফিগ ব্যবহার করতে দিবে
      load: [configuration], // আপনার কনফিগ লোড হবে
      cache: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
