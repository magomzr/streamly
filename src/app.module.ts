import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StepsModule } from './modules/steps.module';

@Module({
  imports: [StepsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
