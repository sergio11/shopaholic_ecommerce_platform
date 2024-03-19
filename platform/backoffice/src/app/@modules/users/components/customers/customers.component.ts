import { Component, OnInit } from '@angular/core';
import { IFilterUser } from '../../../../@shared/interfaces/user.interface';
import { UserService } from 'src/app/@shared/services/user.service';
import { ICustomerState } from 'src/app/@shared/stores/customer/customers.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { CustomersQuery } from 'src/app/@shared/stores/customer/customers.query';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  
  loading = false;
  state: ICustomerState = createInitialState();

  constructor(
    private readonly userService: UserService,
    private readonly customerQuery: CustomersQuery
  ) {}
  
  ngOnInit() {
    this.filterData({ page: 1, take: 10 });
    this.customerQuery.select().subscribe((state: ICustomerState) => {
      console.log(state)
      this.state = state;
    }); 
  }

  async filterData(option: IFilterUser) {
    this.loading = true;
    await this.userService.searchCustomers(option).toPromise();
    this.loading = false;
  }

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
}
