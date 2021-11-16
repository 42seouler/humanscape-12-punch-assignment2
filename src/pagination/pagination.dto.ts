import { ApiProperty } from '@nestjs/swagger';

class PaginationDto {
  @ApiProperty()
  offset: number;
  @ApiProperty()
  skip: number;
}

export default PaginationDto;
