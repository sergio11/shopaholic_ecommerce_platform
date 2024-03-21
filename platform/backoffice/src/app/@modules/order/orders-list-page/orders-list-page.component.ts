import { Component, OnInit } from '@angular/core';
import {
  IBaseFilterQuery,
} from './../../../@shared/interfaces/base.interface';

import { OrderService } from './../../../@shared/services/order.service';
import { OrdersQuery } from 'src/app/@shared/stores/orders/orders.query';
import { IOrderState } from 'src/app/@shared/stores/orders/orders.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './orders-list-page.component.html',
})
export class OrderListComponent implements OnInit {

  loading = false;
  state: IOrderState = createInitialState();

  constructor(
    private readonly orderService: OrderService,
    private readonly productQuery: OrdersQuery,
    private readonly notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.filterData({ page: 1, take: 10 });
    this.productQuery.select().subscribe((state: IOrderState) => {
      console.log(state)
      this.state = state;
    }); 
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'yellow';
      case 'CANCELLED':
        return 'red';
      case 'PAID':
        return 'green';
      default:
        return 'gray';
    }
  }
  
  async filterData(option: IBaseFilterQuery) {
    this.loading = true;
    await this.orderService.search(option).toPromise();
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
    this.orderService.delete(id).subscribe(() => {
      this.notificationService.success('Order Deleted', '');
    });
  }
}
