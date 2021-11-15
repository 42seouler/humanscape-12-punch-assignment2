import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TrialsService } from './trials.service';

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

  describe('loadData', () => {
    it('should have API_KEY_AUTH', () => {
      const apiKey = configService.get('API_KEY_AUTH');
      expect(apiKey).not.toBeUndefined();
    });
  });
});
