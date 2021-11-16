import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TrialsService } from './trials.service';
import { CreateTrialDto } from './dto/create-trial.dto';
import { UpdateTrialDto } from './dto/update-trial.dto';
import PaginationDto from '../pagination/pagination.dto';

@Controller('trials')
export class TrialsController {
  constructor(private readonly trialsService: TrialsService) {}

  @Post()
  create(@Body() createTrialDto: CreateTrialDto) {
    return this.trialsService.create(createTrialDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.trialsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trialsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrialDto: UpdateTrialDto) {
    return this.trialsService.update(+id, updateTrialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trialsService.remove(+id);
  }
}
