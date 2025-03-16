import { ApiProperty } from '@nestjs/swagger';

export class FileDataListDto {
  @ApiProperty({description: 'Unique File Identifier (UUID)'})
  id: string;

  @ApiProperty({description: 'File name'})
  name: string;

  @ApiProperty({description: 'File header'})
  title: string;

  @ApiProperty({description: 'File Category'})
  category: string;
}