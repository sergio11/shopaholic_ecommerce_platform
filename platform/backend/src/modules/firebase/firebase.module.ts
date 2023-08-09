import { Global, Module } from '@nestjs/common';
import admin from 'firebase-admin';
import { STORAGE_BUCKET_URL, STORAGE_PROJECT_ID } from 'src/config/firebase.config';

@Global()
@Module({
  providers: [
    {
      provide: 'FirebaseAdmin',
      useValue: admin.initializeApp({
        credential: admin.credential.cert(require('../../config/serviceAccountKey.json')),
        storageBucket: STORAGE_BUCKET_URL,
        projectId: STORAGE_PROJECT_ID
      }),
    },
  ],
  exports: ['FirebaseAdmin'],
})
export class FirebaseModule {}