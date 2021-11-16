import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateTrialDto } from './dto/create-trial.dto';
import { TrialsRepository } from './trials.repository';
import { Trial } from './entities/trial.entity';
import PaginationDto from '../pagination/pagination.dto';

@Injectable()
export class TrialsService {
  constructor(
    private configService: ConfigService,
    private readonly trialsRepository: TrialsRepository,
  ) {}

  async loadData(page: number, perPage: number, key?: string): Promise<any> {
    const serviceKey =
      key || this.configService.get('API_KEY_AUTH') || 'humanscape';

    const url = 'https://api.odcloud.kr/api/3074271/v1/uddi:cfc19dda-6f75-4c57-86a8-bb9c8b103887';

    const result: AxiosResponse = await axios
      .get(`${url}?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`)
      .then((data) => data.data)
      .catch((e) => {
        console.log('error', e.message);
      });

    return result;
  }

  async create(createTrialDto: CreateTrialDto) {
    return `This action adds a new trial `;
  }

  findAll(paginationDto: PaginationDto) {
    const { offset, skip } = paginationDto;
    //현재시간
    const now = new Date();
    // 현재 기준으로 7일 전 00시00분00초
    const start = new Date(
      now.setUTCHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000,
    );
    // 현재 기준으로 23:59분999초
    const end = new Date(now.setUTCHours(23, 59, 59, 999));

    // query 필터
    const filters = {
      start: start.toISOString(),
      end: end.toISOString(),
    };

    return this.trialsRepository
      .createQueryBuilder('trial')
      .where('updatedAt >= :start')
      .andWhere('updatedAt <= :end')
      .setParameters(filters)
      .orderBy('trial.updatedAt', 'DESC')
      .take(skip)
      .skip(offset * skip)
      .getMany();
  }

  async findOne(id: string): Promise<Trial> {
    const data = await this.trialsRepository.findOne({
      id: id,
    });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Cron(CronExpression.EVERY_WEEK)
  async update(page = 1, perPage = 10) {
    let data = await this.loadData(page, perPage)

    while (page <= data.totalCount) {
      let apiData = await this.loadData(page, perPage) as any;
      page = page + perPage;
      
      for (let i = 0; i < apiData.data.length; i++) {
        let apiDatum = apiData.data[i];
        let trial = await this.trialsRepository.findOne({ id: apiDatum['과제번호'] })
        console.log('datum', apiDatum)
        if (!trial) {
          let newTrial = await this.trialsRepository.create({
            id: apiDatum['과제번호'],
            title: apiDatum['과제명'],
            department: apiDatum['진료과'],
            institution: apiDatum['연구책임기관'],
            subjectCount: Number(apiDatum['전체목표연구대상자수']),
            period: apiDatum['연구기간'],
            researchType: apiDatum['연구종류'],
            stage: apiDatum['임상시험단계(연구모형)'],
            scope: apiDatum['연구범위'],
          });
          await this.trialsRepository.save(newTrial);
        } else {
          let updatedTrial = this.updatedTrialEntity(apiDatum, trial);
          return await this.trialsRepository.update(trial.id, updatedTrial);
        }
  
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
