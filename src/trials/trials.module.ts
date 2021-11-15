import { Module } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { TrialsController } from './trials.controller';
import { Trial } from './entities/trial.entity';
import { TrialsRepository } from './trials.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trial, TrialsRepository]),
  ],
  controllers: [TrialsController],
  providers: [TrialsService]
})
export class TrialsModule {}
