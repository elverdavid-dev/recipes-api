// file-upload-config.ts

import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const imageUploadConfig = new ParseFilePipe({
  validators: [
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg|webp|avif)' }),
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4MB
  ],
});
