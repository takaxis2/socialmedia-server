import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Bind, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Token } from 'src/decorator/token.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  // FilesInterceptor 첫번째 매개변수: formData의 key값,
  // 두번째 매개변수: 파일 최대 갯수
  // 세번째 매개변수: 파일 설정 (위에서 작성했던 multer 옵션들)
  uploadFile(@UploadedFile() file:Express.Multer.File, @Body() createUploadDto: CreateUploadDto, @Token() user:User) {
    console.log(file, createUploadDto);
    // return this.uploadService.uploadFile(createUploadDto, file, user);
  }

  @Post('/files')
  @UseInterceptors(FileInterceptor('files'))
  @Bind(UploadedFiles()) //이게 없으면 위처럼 매개변수에다 써줘야함, 진짜 바인딩
  uploadFiles(file:File[], @Body() createUploadDto: CreateUploadDto, @Token() user:User) {
    return this.uploadService.uploadFiles(createUploadDto);
  }

  
  
}
