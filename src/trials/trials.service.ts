import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateTrialDto } from './dto/create-trial.dto';
import { TrialsRepository } from './trials.repository';
import { Trial } from './entities/trial.entity';

@Injectable()
export class TrialsService {
  constructor(
    private configService: ConfigService,
    private readonly trialsRepository: TrialsRepository,
  ) {}

  async loadData(page: number, perPage: number) {
    const url = 'https://api.odcloud.kr/api/3074271/v1/uddi:cfc19dda-6f75-4c57-86a8-bb9c8b103887';

    const result: AxiosResponse[] = await axios
      .get(
        `${url}?page=${page}&perPage=${perPage}&serviceKey=${this.configService.get('API_KEY_AUTH')}`
      )
      .then((data) => data.data)
      .catch((e) => {
        console.log('error', e.message);
      });

    return result;
  }

  async create(createTrialDto: CreateTrialDto) {
    return `This action adds a new trial `;
  }

  findAll() {
    return `This action returns all trials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trial`;
  }

  @Cron(CronExpression.EVERY_WEEK)
  async update(page = 1, perPage = 10) {
    let apiData = await this.loadData(page, perPage) as any;

    for (let i = 0; i < apiData.data.length; i++) {
      let apiDatum = apiData.data[i];
      let trial = await this.trialsRepository.findOne({ id: apiDatum['과제번호'] })

      if (!trial) {
        await this.trialsRepository.save({
          id: String(apiDatum['과제번호']),
          title: String(apiDatum['과제명']),
          department: String(apiDatum['진료과']),
          institution: String(apiDatum['연구책임기관']),
          subjectCount: Number(apiDatum['전체목표연구대상자수']),
          period: String(apiDatum['연구기간']),
          researchType: String(apiDatum['연구종류']),
          stage: String(apiDatum['임상시험단계(연구모형)']),
          scope: String(apiDatum['연구범위']),
        });
      } else {
        let updatedTrial = this.updatedTrialEntity(apiDatum, trial);
        return await this.trialsRepository.update(trial.id, updatedTrial);
      }

    }
  }

  updatedTrialEntity(apiDatum, dbDatum) {
    let update: Partial<Trial> = {};

    if (apiDatum['과제명'] !== dbDatum.title) 
      update[dbDatum.title] = apiDatum['과제명']
      
    if (apiDatum['진료과'] !== dbDatum.department) 
      update[dbDatum.department] = apiDatum['진료과']

    if (apiDatum['연구책임기관'] !== dbDatum.institution) 
      update[dbDatum.institution] = apiDatum['연구책임기관']

    if (apiDatum['전체목표연구대상자수'] !== dbDatum.subjectCount) 
      update[dbDatum.subjectCount] = apiDatum['전체목표연구대상자수']

    if (apiDatum['연구기간'] !== dbDatum.period) 
      update[dbDatum.period] = apiDatum['연구기간']

    if (apiDatum['연구종류'] !== dbDatum.researchType) 
      update[dbDatum.researchType] = apiDatum['연구종류']

    if (apiDatum['임상시험단계'] !== dbDatum.stage) 
      update[dbDatum.stage] = apiDatum['임상시험단계']

    if (apiDatum['연구범위'] !== dbDatum.scope) 
      update[dbDatum.scope] = apiDatum['연구범위']

    return update;
  }


}
