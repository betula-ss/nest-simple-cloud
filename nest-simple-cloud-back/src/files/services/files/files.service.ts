import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileData } from '../../entity/file-data.entity';

@Injectable()
export class FilesService {

  constructor(
    @InjectRepository(FileData)
    private readonly fileDataRepository: Repository<FileData>,
  ) {}

  async getFiles(): Promise<FileData[]> {
    try {
      return await this.fileDataRepository.find({
        select: ['id', 'name', 'title', 'category'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getFileById(id: string): Promise<FileData> {
    const file = await this.fileDataRepository.findOne({where: {id}});
    if (!file) {
        throw new NotFoundException('File not found');
    }
    return file;
  }

  async createFile(fileData: Partial<FileData>): Promise<FileData> {
    try {
      const newFile = this.fileDataRepository.create(fileData);
      return await this.fileDataRepository.save(newFile);
    } catch (error) {
      throw error;
    }
  }

  async updateFile(id: string, updateData: Partial<FileData>): Promise<FileData> {
    const file = await this.fileDataRepository.findOne({where: {id}});
    if (!file) {
      throw new NotFoundException('File not found');
    }
    Object.assign(file, updateData);
    return await this.fileDataRepository.save(file);
  }

  async deleteFile(id: string): Promise<void> {
    const result = await this.fileDataRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('File not found');
    }
  }
}
