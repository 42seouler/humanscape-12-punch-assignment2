import { EntityRepository, Repository } from 'typeorm';
import { Trial } from './entities/trial.entity';

@EntityRepository(Trial)
export class TrialsRepository extends Repository<Trial> {}
