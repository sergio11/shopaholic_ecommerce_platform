import { Global, Module } from "@nestjs/common";
import { STORAGE_SERVICE } from "./storage.service";
import { MinioStorageService } from "./impl/minio-storage.service";

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: MinioStorageService
    }
  ],
  exports: [ STORAGE_SERVICE ]
  
})
export class FilesStorageModule {}