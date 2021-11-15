import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrialsModule } from './trials/trials.module';

@Module({
  imports: [TrialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
