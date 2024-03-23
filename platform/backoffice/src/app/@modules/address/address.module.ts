import { AntDesignModule } from '../../@core/ant-design.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddressListComponent } from './address-list-page/address-list-page.component';
import { AddressRoutingModule } from './address-routing.module';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [
    AddressListComponent
  ],
  imports: [
    AddressRoutingModule,
    CommonModule, 
    AntDesignModule,
    NzTagModule
  ],
})
export class AddressModule {}
