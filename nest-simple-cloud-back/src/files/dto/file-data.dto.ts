import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileDataDto {
  @ApiProperty({description: 'Unique File Identifier (UUID)'})
  id: string;

  @ApiProperty({description: 'File name'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: 'File header'})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: 'File Category'})
  @IsString()
  category: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The contents of the file are in binary format (BLOB)',
  })
  document: Buffer;
}