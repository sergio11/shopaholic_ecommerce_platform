import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { fileValidator } from '../file.validator';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const defaultFieldName = 'imageFile';
const defaultAllowedExtensions = ['.png', '.jpeg', '.jpg'];
const defaultMaxSize = 1024 * 1024 * 10; // 10 MB

export interface UploadFileValidationOptions {
    uploadFields?: MulterField[],
    allowedExtensions?: string[],
    maxSize?: number,
    isOptional?: boolean
}

export function DefaultUploadFileValidationDecorator(
    options: UploadFileValidationOptions = {} // Provide default empty object
) {
    const {
        uploadFields = [{ name: defaultFieldName, maxCount: 1 }],
        allowedExtensions = defaultAllowedExtensions,
        maxSize = defaultMaxSize,
        isOptional = false
    } = options;

    return applyDecorators(
        UseInterceptors(FileFieldsInterceptor(uploadFields, {
            fileFilter: fileValidator(allowedExtensions, maxSize, isOptional)
        }))
    );
}
