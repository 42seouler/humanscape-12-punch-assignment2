import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrialsRepository } from './trials.repository';
import { Trial } from './entities/trial.entity';
import PaginationDto from '../pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrialsService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Trial)
    private readonly trialsRepository: TrialsRepository,
  ) {}

  async loadData(page: number, perPage: number, key?: string): Promise<any> {
    const serviceKey =
      key || this.configService.get('API_KEY_AUTH') || 'humanscape';

    const url =
      'https://api.odcloud.kr/api/3074271/v1/uddi:cfc19dda-6f75-4c57-86a8-bb9c8b103887';

    const result: AxiosResponse = await axios
      .get(`${url}?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`)
      .then((data) => data.data)
      .catch((e) => {
        console.log('error', e.message);
      });

    return result;
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
  async batchTask(page = 1, perPage = 10) {
    const data = await this.loadData(page, perPage);

    while (page <= data.totalCount) {
      const apiData = await this.loadData(page, perPage);

      page = page + perPage;

      for (let i = 0; i < apiData.data.length; i++) {
        const apiDatum = apiData.data[i];
        const trial = await this.trialsRepository.findOne({
          id: apiDatum['과제번호'],
        });

        if (!trial) {
          await this.insertTrialEntity(apiDatum);
        } else {
          await this.updateTrialEntity(apiDatum, trial);
        }
      }
    }
  }

  async insertTrialEntity(apiDatum) {
    const newTrial = await this.trialsRepository.create({
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
    return await this.trialsRepository.save(newTrial);
  }

  async updateTrialEntity(apiDatum, dbDatum) {
    const update: Partial<Trial> = {};

    if (apiDatum['과제명'] !== dbDatum.title)
      update['title'] = apiDatum['과제명'];

    if (apiDatum['진료과'] !== dbDatum.department)
      update['department'] = apiDatum['진료과'];

    if (apiDatum['연구책임기관'] !== dbDatum.institution)
      update['institution'] = apiDatum['연구책임기관'];

    if (apiDatum['전체목표연구대상자수'] !== dbDatum.subjectCount)
      update['subjectCount'] = apiDatum['전체목표연구대상자수'];

    if (apiDatum['연구기간'] !== dbDatum.period)
      update['period'] = apiDatum['연구기간'];

    if (apiDatum['연구종류'] !== dbDatum.researchType)
      update['researchType'] = apiDatum['연구종류'];

    if (apiDatum['임상시험단계(연구모형)'] !== dbDatum.stage)
      update['stage'] = apiDatum['임상시험단계(연구모형)'];

    if (apiDatum['연구범위'] !== dbDatum.scope)
      update['scope'] = apiDatum['연구범위'];

    return await this.trialsRepository.update({ id: dbDatum.id }, update);
  }
}
