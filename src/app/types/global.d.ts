declare namespace Express {
  export interface Multer {
    File: {
      /** Nama file asli */
      originalname: string;
      /** Nama file pada server */
      filename: string;
      /** MIME type file */
      mimetype: string;
      /** Buffer dari file (jika digunakan) */
      buffer: Buffer;
      /** Ukuran file dalam byte */
      size: number;
    };
  }
}
