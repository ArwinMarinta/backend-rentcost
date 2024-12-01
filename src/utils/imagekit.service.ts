import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { Express } from 'express';

@Injectable()
export class ImageKitService {
  private imageKit: ImageKit;

  constructor() {
    this.imageKit = new ImageKit({
      publicKey: 'public_+KVk/cSSkMMgJBZVrPnyYah3OrE=',
      privateKey: 'private_hNWzmAMYG07trG3eW1TbrhFkX6A=',
      urlEndpoint: 'https://ik.imagekit.io/xoh0kfeiy/',
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    const fileName = file.originalname; // Nama file yang diupload
    const fileBuffer = file.buffer; // Buffer file yang diupload

    return new Promise((resolve, reject) => {
      this.imageKit.upload(
        {
          file: fileBuffer.toString('base64'), // File dalam format base64
          fileName: fileName, // Nama file
          folder: '/product', // Folder di ImageKit (Opsional)
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }
}
