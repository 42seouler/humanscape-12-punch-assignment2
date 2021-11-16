import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { ApiTags,ApiOperation } from '@nestjs/swagger';
import PaginationDto from '../pagination/pagination.dto';

@ApiTags('trials')
@Controller('trials')
export class TrialsController {
  constructor(private readonly trialsService: TrialsService) {}

  @ApiOperation({ summary: '일주일 내에 업데이트 된 임상정보 리스트' })
  @Get('updateList')
  async findUpdateList(@Query() paginationDto: PaginationDto) {
    return this.trialsService.findUpdateList(paginationDto);
  }

  @ApiOperation({ summary: '수집한 임상정보 전체 리스트 + 검색' })
  @Get()
  async findAll(@Query('search') search: string, @Query() paginationDto: PaginationDto) {
    return this.trialsService.findAll(search, paginationDto);
  }

  @ApiOperation({ summary: '과제번호로 특정 임상정보 조회' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trialsService.findOne(id);
  }
  
}
