import express from 'express';
import { extname } from 'path';

const allowedExtensions = ['.png', '.svg', '.jpg', '.jpeg', '.webp', '.avif'];

export function fileFilter(
  req: express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const ext = extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    callback(null, true);
  } else {
    callback(new Error('Tipo de archivo no permitido'), false);
  }
}
