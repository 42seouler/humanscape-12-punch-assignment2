import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TrialsService } from './trials.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('TrialsService', () => {
  let service: TrialsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [TrialsService, ConfigService],
    }).compile();

    service = module.get<TrialsService>(TrialsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('TrialService should be defined', () => {
    expect(service).toBeDefined();
  });
  it('ConfigService should be defined', () => {
    expect(configService).toBeDefined();
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
}); // end TrialsService
