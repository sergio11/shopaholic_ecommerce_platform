import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { IStorageService } from '../storage.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioStorageService implements IStorageService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {

    const minioEndpoint = this.configService.get<string>('MINIO_SERVER_HOST');
    const minioPort = Number(this.configService.get<number>('MINIO_SERVER_PORT'));
    const minioUseSSL = Boolean(this.configService.get<boolean>('MINIO_SERVER_USE_SSL'));
    const minioAccessKey = this.configService.get<string>('MINIO_SERVER_ACCESS_KEY');
    const minioSecretKey = this.configService.get<string>('MINIO_SERVER_SECRET_KEY');
    this.bucketName = this.configService.get<string>('MINIO_SERVER_BUCKET_NAME');


    this.minioClient = new Minio.Client({
      endPoint: minioEndpoint,
      port: minioPort,
      useSSL: minioUseSSL,
      accessKey: minioAccessKey,
      secretKey: minioSecretKey,
    });
    
    this.checkAndCreateBucket().catch((error) => {
      console.error('Error checking and creating bucket:', error);
    });
  }

  public async saveFile(file: Buffer, contentType: string): Promise<string> {
    const fileName = `${uuidv4()}.${contentType.split('/')[1]}`; // Generate a UUID and append it to the filename
    const readableStream = new Readable();
    readableStream.push(file);
    readableStream.push(null); // final stream

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

  private async checkAndCreateBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.minioClient.bucketExists(this.bucketName, (err, exists) => {
        if (err) {
          reject(err);
        } else {
          if (!exists) {
            this.minioClient.makeBucket(this.bucketName, 'us-east-1', (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        }
      });
    });
  }
}