import { Module } from "@nestjs/common";
import { STORAGE_SERVICE } from "./storage.service";
import { MinioStorageService } from "./impl/minio-storage.service";
import { ImagesModule } from "../images/images.module";
import { StorageMixin } from "./mixin/storage.mixin";

@Module({
  imports: [ ImagesModule ],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: MinioStorageService
    },
    StorageMixin
  ],
  exports: [ STORAGE_SERVICE, StorageMixin ]
  
})
export class FilesStorageModule {}