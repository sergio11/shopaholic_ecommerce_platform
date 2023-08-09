import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { IStorageService } from '../storage.service';


@Injectable()
export class MinioStorageService implements IStorageService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string = 'my-bucket'; // Nombre del bucket de MinIO

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'minio-server', // Cambia esto al host de tu servidor MinIO
      port: 9000, // Puerto de MinIO
      useSSL: false, // Cambia a true si estás usando SSL/TLS
      accessKey: 'your-access-key', // Cambia a tus credenciales de acceso
      secretKey: 'your-secret-key',
    });
  }

  async saveFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const readableStream = new Readable();
    readableStream.push(file);
    readableStream.push(null); // Indica el final del stream

    const uploadOptions = {
      'Content-Type': contentType,
    };

    try {
      await this.minioClient.putObject(this.bucketName, fileName, readableStream, file.length, uploadOptions);
      const url = this.minioClient.presignedGetObject(this.bucketName, fileName);
      return url;
    } catch (error) {
      console.error('Error saving file to MinIO:', error);
      throw new Error('Error saving file to MinIO');
    }
  }
}