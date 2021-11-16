import { ApiProperty } from '@nestjs/swagger';

class PaginationDto {
  @ApiProperty({description: '페이지 번호'})
  offset: number;
  @ApiProperty({description: '한 번에 가져올 데이터 갯수'})
  skip: number;
}

export default PaginationDto;
