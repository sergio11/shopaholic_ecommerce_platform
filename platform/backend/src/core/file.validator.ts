import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const fileValidator = (
  allowedExtensions: string[],
  maxSize: number,
  isOptional: boolean = false,
) => (req: any, file: any, callback: any) => {
  if (!file && isOptional) {
    return callback(null, true);
  }
  
  if (!file) {
    return callback(new BadRequestException('File is required'), false);
  }

  const ext = extname(file.originalname);
  if (!allowedExtensions.includes(ext.toLowerCase())) {
    return callback(
      new BadRequestException(`File type ${ext} is not allowed`),
      false,
    );
  }
  if (file.size > maxSize) {
    return callback(
      new BadRequestException(`File size exceeds ${maxSize} bytes`),
      false,
    );
  }
  callback(null, true);
};
