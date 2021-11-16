import { Test, TestingModule } from '@nestjs/testing';
import { TrialsService } from './trials.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Trial } from './entities/trial.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrialsRepository } from './trials.repository';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('TrialsService', () => {
  let service: TrialsService;
  let configService: ConfigService;
  let trialsRepository: MockRepository<Trial>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [
        TrialsService,
        ConfigService,
        TrialsRepository,
        { provide: getRepositoryToken(Trial), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<TrialsService>(TrialsService);
    configService = module.get<ConfigService>(ConfigService);
    trialsRepository = module.get<MockRepository>(getRepositoryToken(Trial));
  });

  it('TrialService should be defined', () => {
    expect(service).toBeDefined();
  });
  it('ConfigService should be defined', () => {
    expect(configService).toBeDefined();
  });
  it('trialsRepository should be defined', () => {
    expect(trialsRepository).toBeDefined();
  });

  describe('loadDate 의', () => {
    it('should have API_KEY_AUTH', () => {
      const apiKey = configService.get('API_KEY_AUTH');
      expect(apiKey).not.toBeUndefined();
    }); // serviceKey get
    it('Status: 200, 성공적으로 수행 됨', async () => {
      const page = 1;
      const perPage = 5;
      const key = configService.get('API_KEY_AUTH');
      const result = await service.loadData(page, perPage, key);
      expect(result).toBeInstanceOf(Object);
    }); // page, perPage, serviceKey OK
    it('Status: 401, 인증 정보가 정확 하지 않음', async () => {
      const page = 1;
      const perPage = 5;
      const key = ' ';
      const result = await service.loadData(page, perPage, key);
      expect(result).toBeUndefined(); // undefined
    }); // page, perPage OK, serviceKey blank
  }); // end loadDate()

  describe('findOne 의', () => {
    it('Status: 200, 성공적으로 수행 됨', async () => {
      const id = 'C130010';
      const temp = {
        id: id,
        title: '조직구증식증 임상연구 네트워크 구축 및 운영(HLH)',
        department: 'Pediatrics',
        institution: '서울아산병원',
        subjectCount: 120,
        period: '3년',
        researchType: '관찰연구',
        stage: '코호트',
        scope: '국내다기관',
      };
      trialsRepository.findOne.mockResolvedValue(temp);
      const result = await service.findOne(id);
      expect(result.id).toEqual(temp.id);
    }); // end status 200
    it('Status: 404 Not Found, 요청 리소스를 찾을 수 없음', async () => {
      const id = 'temp';
      try {
        await service.findOne(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    }); // end status 404
  }); // end findOne()
}); // end TrialsService
