// import {
//   Controller,
//   Post,
//   UseInterceptors,
//   UploadedFile,
//   BadRequestException,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { FileUploadService } from 'src/utils/imagekit.service';

// @Controller('upload')
// export class FileUploadController {
//   constructor(private readonly fileUploadService: FileUploadService) {}

//   @Post('image')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Array<Express.Multer.File>) {
//     if (!file) {
//       throw new BadRequestException('File is required');
//     }

//     try {
//       const result = await this.fileUploadService.uploadFile(file);
//       return {
//         message: 'File uploaded successfully',
//         url: result.url, // URL file yang diunggah
//       };
//     } catch (error) {
//       throw new BadRequestException('Upload failed: ' + error.message);
//     }
//   }
// }
