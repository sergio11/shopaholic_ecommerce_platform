import { Global, Module } from "@nestjs/common";
import { FirebaseStorageService } from "./impl/firebase.storage.service";
import { STORAGE_SERVICE } from "./storage.service";

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: FirebaseStorageService
    }
  ],
  exports: [ STORAGE_SERVICE ]
  
})
export class FilesStorageModule {}