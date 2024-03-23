import { Component, OnInit } from '@angular/core';
import {
  IBaseFilterQuery,
} from '../../../@shared/interfaces/base.interface';

import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { IAddressState } from 'src/app/@shared/stores/address/address.store';
import { AddressQuery } from 'src/app/@shared/stores/address/address.query';
import { AddressService } from 'src/app/@shared/services/address.service';

@Component({
  templateUrl: './address-list-page.component.html',
})
export class AddressListComponent implements OnInit {

  loading = false;
  state: IAddressState = createInitialState();

  constructor(
    private readonly addressService: AddressService,
    private readonly addressQuery: AddressQuery,
    private readonly notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.filterData({ page: 1, take: 10 });
    this.addressQuery.select().subscribe((state: IAddressState) => {
      this.state = state;
    }); 
  }
  
  async filterData(option: IBaseFilterQuery) {
    this.loading = true;
    await this.addressService.search(option).toPromise();
    this.loading = false;
  }

  //*Table Pagination
  onChangePage(page: number) {
    this.filterData({ page: page, take: 10 });
  }

  onChangeSearch(e: any) {
    this.filterData({
      page: this.state.meta.currentPage,
      take: 10,
      searchTerm: e?.target?.value,
    });
  }

  onDelete(id: string) {
    this.addressService.delete(id).subscribe(() => {
      this.notificationService.success('Address Deleted', '');
    });
  }
}
