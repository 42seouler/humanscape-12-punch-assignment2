import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { CreateTrialDto } from './dto/create-trial.dto';
import { UpdateTrialDto } from './dto/update-trial.dto';

@Injectable()
export class TrialsService {
  constructor(private configService: ConfigService) {}

  async loadData(page: number, perPage: number) {
    const url =
      'https://api.odcloud.kr/api/3074271/v1/uddi:cfc19dda-6f75-4c57-86a8-bb9c8b103887';

    const result: AxiosResponse = await axios
      .get(
        `${url}?page=${page}&perPage=${perPage}&serviceKey=${this.configService.get(
          'API_KEY_AUTH',
        )}`,
      )
      .then((data) => data.data)
      .catch((e) => {
        console.log(e);
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

  update(id: number, updateTrialDto: UpdateTrialDto) {
    return `This action updates a #${id} trial`;
  }

  remove(id: number) {
    return `This action removes a #${id} trial`;
  }
}
