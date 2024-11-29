import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class FileUploadService {
  private imageKit: ImageKit;

  constructor() {
    this.imageKit = new ImageKit({
      publicKey: 'your-public-key', // Ganti dengan public key ImageKit Anda
      privateKey: 'your-private-key', // Ganti dengan private key ImageKit Anda
      urlEndpoint: 'https://ik.imagekit.io/your-imagekit-id', // URL endpoint ImageKit
    });
  }

  async uploadFile(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const filePath = file.buffer; // Anda bisa menggunakan file buffer untuk upload
      const fileName = file.originalname;

      this.imageKit.upload(
        {
          file: filePath,
          fileName: fileName,
          folder: '/uploads/', // Anda bisa menentukan folder di ImageKit
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
