import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { TrialsService } from './trials.service';
import PaginationDto from '../pagination/pagination.dto';

@Controller('trials')
export class TrialsController {
  constructor(private readonly trialsService: TrialsService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.trialsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trialsService.findOne(id);
  }

  @Patch(':id')
  update() {
    this.trialsService.batchTask()
  }
}
