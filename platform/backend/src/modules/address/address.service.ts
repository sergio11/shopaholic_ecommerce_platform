import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { Repository } from 'typeorm';
import { SupportService } from 'src/core/support.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AddressService extends SupportService {

    constructor(
        @InjectRepository(AddressEntity) private addressRepository: Repository<AddressEntity>,
        i18n: I18nService
    ) {
        super(i18n);
    }

    create(address: CreateAddressDto) {
        const newAddress = this.addressRepository.create(address);
        return this.addressRepository.save(newAddress);
    }

    findAll() {
        return this.addressRepository.find()
    }
    
    findByUser(id: string) {
        return this.addressRepository.findBy({ idUser: id })
    }

    async update(id: string, address: UpdateAddressDto) {
        const addressFound = await this.findAddress(id);
        const updatedAddress = Object.assign(addressFound, address);
        return this.addressRepository.save(updatedAddress);
    }
    
    async delete(id: string) {
        await this.findAddress(id);
        return this.addressRepository.delete(id);
    }


    private async findAddress(id: string) {
        const addressFound = await this.addressRepository.findOneBy({ id: id });
        if (!addressFound) {
            this.throwNotFoundException("ADDRESS_NOT_FOUND");
        }
        return addressFound;
    }

}