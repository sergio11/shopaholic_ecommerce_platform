import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsEntity } from './brand.entity';
import { BrandService } from './brands.service';
import { BrandController } from './brands.controller';

@Module({
    imports: [ 
        TypeOrmModule.forFeature([BrandsEntity])
    ],
    providers: [BrandService, BrandService],
    controllers: [BrandController],
    exports: [BrandService, BrandService]
})
export class BrandModule {}
