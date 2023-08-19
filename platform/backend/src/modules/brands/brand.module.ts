import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsEntity } from './brand.entity';
import { BrandService } from './brands.service';
import { BrandController } from './brands.controller';
import { BrandsMapper } from './brands.mapper';
import { FilesStorageModule } from '../storage/storage.module';

@Module({
    imports: [ 
        TypeOrmModule.forFeature([BrandsEntity]),
        FilesStorageModule
    ],
    providers: [BrandService, BrandsMapper],
    controllers: [BrandController],
    exports: [BrandService, BrandsMapper]
})
export class BrandModule {}
