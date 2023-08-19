import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { IStorageService } from '../storage.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SupportService } from '../../../core/support.service';
import { I18nService } from 'nestjs-i18n';

/**
 * Storage service that utilizes MinIO as the backend.
 */
@Injectable()
export class MinioStorageService extends SupportService implements IStorageService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly regionName: string;

  /**
   * Creates an instance of MinioStorageService.
   * @param {ConfigService} configService - The NestJS configuration service.
   * @param {I18nService} i18n - The internationalization service.
   */
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    i18n: I18nService
  ) {
    super(i18n)
    // MinIO Configuration
    const minioEndpoint = this.configService.get<string>('MINIO_SERVER_HOST');
    const minioPort = Number(this.configService.get<number>('MINIO_SERVER_PORT'));
    const minioUseSSL = false;
    const minioAccessKey = this.configService.get<string>('MINIO_SERVER_ACCESS_KEY');
    const minioSecretKey = this.configService.get<string>('MINIO_SERVER_SECRET_KEY');
    this.bucketName = this.configService.get<string>('MINIO_SERVER_BUCKET_NAME');
    this.regionName = this.configService.get<string>('MINIO_SERVER_REGION_NAME');


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

  /**
   * Updates an existing file in storage.
   * @param {string} id - The ID of the file.
   * @param {Buffer} newFile - The new content of the file.
   * @param {string} contentType - The content type of the file.
   * @param {number} length - The length of the file.
   * @returns {Promise<{ id: string; url: string }>} - The updated file information.
   */
  public async updateFile(id: string, newFile: Buffer, contentType: string, length: number): Promise<{ id: string; url: string }> {
    const existingObject = await this.getObjectInfo(id);
    if (!existingObject) {
      this.throwNotFoundException("FILE_NOT_FOUND");
    }
    try {
      await this.minioClient.removeObject(this.bucketName, id);
      const result = await this.saveFile(newFile, contentType, length);
      if(!result) {
        this.throwInternalServerError("FILE_UPDATING_ERROR");
      }
      return result;
    } catch (error) {
      console.error('Error updating file in MinIO:', error);
      this.throwInternalServerError("FILE_UPDATING_ERROR");
    }
  }

  /**
   * Saves a file to storage.
   * @param {Buffer} file - The content of the file.
   * @param {string} contentType - The content type of the file.
   * @param {number} length - The length of the file.
   * @returns {Promise<{ id: string; url: string }>} - The saved file information.
   */
  public async saveFile(file: Buffer, contentType: string, length: number): Promise<{ id: string; url: string }> {
    const id = uuidv4();
    const fileName = `${id}`; // Use the generated UUID as the filename
    const readableStream = new Readable();
    readableStream.push(file);
    readableStream.push(null); // final stream

    const uploadOptions = {
      'Content-Type': contentType,
    };

    try {
      await this.minioClient.putObject(this.bucketName, fileName, readableStream, length, uploadOptions);
      const url = await this.minioClient.presignedGetObject(this.bucketName, fileName);
      if(!url) {
        this.throwInternalServerError("FILE_SAVING_ERROR");
      }
      return { id, url };
    } catch (error) {
      console.error('Error saving file to MinIO:', error);
      this.throwInternalServerError("FILE_SAVING_ERROR");
    }
  }

  /**
   * Deletes a file from storage.
   * @param {string} id - The ID of the file to delete.
   * @returns {Promise<void>}
   */
  public async deleteFile(id: string): Promise<void> {
    const existingObject = await this.getObjectInfo(id);
    if (!existingObject) {
      this.throwNotFoundException("FILE_NOT_FOUND");
    }
    try {
      await this.minioClient.removeObject(this.bucketName, id);
    } catch (error) {
      console.error('Error deleting file from MinIO:', error);
      this.throwInternalServerError("FILE_DELETING_ERROR");
    }
  }

  /**
     * Gets information about an object in the storage bucket.
     * @param {string} id - The ID of the object.
     * @returns {Promise<Minio.BucketItem | null>} - The object information or null if not found.
     */
  private async getObjectInfo(id: string): Promise<Minio.BucketItem | null> {
    return new Promise<Minio.BucketItem | null>((resolve, reject) => {
        this.minioClient.statObject(this.bucketName, id, (err, stat: Minio.BucketItemStat) => {
            if (err) {
                if ((err as any).code === 'NotFound') { // Use type assertion here
                    resolve(null);
                } else {
                    reject(err);
                }
            } else {
                // Create a BucketItem-like object with the required properties
                const bucketItem: Minio.BucketItem = {
                  name: id,
                  etag: stat.etag,
                  lastModified: stat.lastModified,
                  size: stat.size,
                  prefix: '', // Set it to an empty string or omit it if not needed
                };
                resolve(bucketItem);
            }
        });
    });
  }

  /**
   * Checks for the existence of a bucket and creates it if it doesn't exist.
   * @returns {Promise<void>}
   */
  private async checkAndCreateBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.minioClient.bucketExists(this.bucketName, (err, exists) => {
        if (err) {
          reject(err);
        } else {
          if (!exists) {
            this.minioClient.makeBucket(this.bucketName, this.regionName, (err) => {
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