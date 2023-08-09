import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { IStorageService } from '../storage.service';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable()
export class FirebaseStorageService implements IStorageService {
    
    private bucket: any;

    constructor(
        @Inject('FirebaseAdmin') 
        private readonly firebaseAdmin: admin.app.App
    ) {
        this.bucket = this.firebaseAdmin.storage().bucket();
    }

    public async saveFile(file: Buffer, fileName: string, contentType: String): Promise<string> {
        try {
        const options = {
            destination: fileName,
            metadata: {
                contentType: contentType
            },
        };

        console.log(`saveFile -> ${fileName}`);
        const tempFilePath = path.join(os.tmpdir(), fileName);
        await fs.promises.writeFile(tempFilePath, file);

        await this.bucket.upload(tempFilePath, options);

        const url = await this.generateDownloadUrl(fileName);
        return url;
        } catch (error) {
            console.log(error);
        throw new NotFoundException('Error uploading file');
        }
    }

    private async generateDownloadUrl(remoteFileName: string): Promise<string> {
        const [url] = await this.bucket.file(remoteFileName).getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // Cambiar a una fecha futura deseada
        });

        return url;
    }
}