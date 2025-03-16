import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './services/files/files.service';
import { FileData } from './entity/file-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileData])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
