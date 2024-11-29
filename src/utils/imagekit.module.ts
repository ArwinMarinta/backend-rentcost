import { Module } from '@nestjs/common';

// Menggunakan require untuk mengimpor ImageKit jika ekspor bukan default
import ImageKit from 'imagekit';

@Module({
  providers: [
    {
      provide: 'IMAGEKIT',
      useFactory: () => {
        return new ImageKit({
          publicKey: 'public_+KVk/cSSkMMgJBZVrPnyYah3OrE=',
          privateKey: 'private_hNWzmAMYG07trG3eW1TbrhFkX6A=',
          urlEndpoint: 'https://ik.imagekit.io/xoh0kfeiy/',
        });
      },
    },
  ],
  exports: ['IMAGEKIT'],
})
export class ImageKitModule {}
