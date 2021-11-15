import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Trial } from './trials/entities/trial.entity';
import { TrialsModule } from './trials/trials.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './humanscape.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TrialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
