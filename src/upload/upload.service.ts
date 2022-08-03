import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Injectable()
export class UploadService {

/**
 * 여기서는 파일 생성만 하면 된다
*/


  async uploadFile(uploadDto: CreateUploadDto, file:File, User:User){}

  async uploadFiles(uploadDto: CreateUploadDto){}
}
