import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { SupportService } from 'src/core/support.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AddressService extends SupportService {

    constructor(
        @InjectRepository(Address) private addressRepository: Repository<Address>,
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
    
    findByUser(idUser: number) {
        return this.addressRepository.findBy({ id_user: idUser })
    }

    async update(id: number, address: UpdateAddressDto) {
        const addressFound = await this.addressRepository.findOneBy({ id: id });
        if (!addressFound) {
            throw new HttpException(this.resolveString("ADDRESS_NOT_FOUND"), HttpStatus.NOT_FOUND);
        }
        const updatedAddress = Object.assign(addressFound, address);
        return this.addressRepository.save(updatedAddress);
    }
    
    async delete(id: number) {
        const addressFound = await this.addressRepository.findOneBy({ id: id });
        if (!addressFound) {
            throw new HttpException(this.resolveString("ADDRESS_NOT_FOUND"), HttpStatus.NOT_FOUND);
        }
        return this.addressRepository.delete(id);
    }

}
