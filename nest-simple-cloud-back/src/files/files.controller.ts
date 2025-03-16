import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Res,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesService } from './services/files/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileDataListDto } from './dto/file-data-list.dto';
import { FileDataDto } from './dto/file-data.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Files')
@Controller('files')
@UseGuards(AuthGuard('jwt'))
export class FilesController {

  constructor(private readonly fs: FilesService) {}

  @Get()
  @ApiOperation({summary: 'Get a list of files'})
  @ApiResponse({
    status: 200,
    description: 'The list of files was successfully received',
    type: [FileDataListDto],
  })
  async getFiles(): Promise<FileDataListDto[]> {
    const files = await this.fs.getFiles();
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      title: file.title,
      category: file.category
    }));
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a document by id'})
  @ApiResponse({
    status: 200,
    description: 'The document was received successfully',
    type: [FileDataDto]
  })
  async getFile(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const fileEntity = await this.fs.getFileById(id);
    const fileDto: FileDataDto = {
      id: fileEntity.id,
      name: fileEntity.name,
      title: fileEntity.title,
      category: fileEntity.category,
      document: fileEntity.document,
    };
    let contentType: string;
    switch (fileDto.name.split('.').pop()?.toLowerCase()) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'docx':
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        contentType = 'application/octet-stream';
        break;
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileDto.name}"`);
    return res.send(fileDto.document);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary: 'Create a new document'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document to download',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        title: { type: 'string' },
        category: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'title', 'category', 'file']
    },
  })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {title: string, category?: string},
  ): Promise<FileDataDto> {
    const fileEntity = await this.fs.createFile({
      name: file.originalname,
      title: body.title,
      category: body.category ? body.category : "",
      document: file.buffer
    });
    return {
      id: fileEntity.id,
      name: fileEntity.name,
      title: fileEntity.title,
      category: fileEntity.category,
      document: fileEntity.document
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary:'Edit a document by id'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for updating the document',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        title: { type: 'string' },
        category: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'title', 'category', 'file']
    },
  })
  async updateFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {title?: string, category?: string},
  ): Promise<FileDataDto> {
    const updateData: Partial<FileDataDto> = {};
    updateData.name = file.originalname;
    if (body.title) {
      updateData.title = body.title;
    }
    if (body.category) {
      updateData.category = body.category;
    }
    if (file) {
      updateData.document = file.buffer;
    }
    const updatedEntity = await this.fs.updateFile(id, updateData);
    return {
      id: updatedEntity.id,
      name: updatedEntity.name,
      title: updatedEntity.title,
      category: updatedEntity.category,
      document: updatedEntity.document
    };
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a document by id'})
  @ApiResponse(
    {
      status: 200,
      description: 'The document was successfully deleted'
    })
  async deleteFile(@Param('id') id: string): Promise<boolean> {
    await this.fs.deleteFile(id);
    return true;
  }
}
