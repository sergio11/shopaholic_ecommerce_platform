import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@Injectable()
export class AddressService extends SupportService {

    constructor(
        @InjectRepository(AddressEntity) private addressRepository: Repository<AddressEntity>,
        @InjectMapper() private readonly mapper: Mapper,
        i18n: I18nService
    ) {
        super(i18n);
    }

    async create(address: CreateAddressDto): Promise<AddressResponseDto> {
        const newAddress = this.mapper.map(address, CreateAddressDto, AddressEntity);
        const savedAddress = await this.addressRepository.save(newAddress);
        return this.mapper.map(savedAddress, AddressEntity, AddressResponseDto);
    }

    async findAll(): Promise<AddressResponseDto[]> {
        const addresses = await this.addressRepository.find();
        return this.mapper.mapArray(addresses, AddressEntity, AddressResponseDto);
    }
    
    async findByUser(id: string): Promise<AddressResponseDto[]> {
        const addresses = await this.addressRepository.find({ where: { idUser: id } });
        return this.mapper.mapArray(addresses, AddressEntity, AddressResponseDto);
    }

    async update(id: string, address: UpdateAddressDto): Promise<AddressResponseDto> {
        const addressFound = await this.findAddress(id);
        const updatedAddress = this.mapper.map(address, UpdateAddressDto, AddressEntity, addressFound);
        const savedAddress = await this.addressRepository.save(updatedAddress);
        return this.mapper.map(savedAddress, AddressEntity, AddressResponseDto);
    }
    
    async delete(id: string): Promise<void> {
        await this.findAddress(id);
        await this.addressRepository.delete(id);
    }

    private async findAddress(id: string): Promise<AddressEntity> {
        const addressFound = await this.addressRepository.findOne({ where: { id: id } });
        if (!addressFound) {
            this.throwNotFoundException('ADDRESS_NOT_FOUND');
        }
        return addressFound;
    }

}
