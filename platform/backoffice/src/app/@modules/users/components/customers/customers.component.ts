import { Component, OnInit } from '@angular/core';
import { IFilterUser } from '../../../../@shared/interfaces/user.interface';
import { UserService } from 'src/app/@shared/services/user.service';
import { IUserState } from 'src/app/@shared/stores/users/users.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { UsersQuery } from 'src/app/@shared/stores/users/users.query';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  
  loading = false;
  state: IUserState = createInitialState();

  constructor(
    private readonly userService: UserService,
    private readonly userQuery: UsersQuery,
    private readonly notificationService: NzNotificationService
  ) {}
  
  ngOnInit() {
    this.filterData({ page: 1, take: 10 });
    this.userQuery.select().subscribe((state: IUserState) => {
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

  onDelete(id: string) {
    this.userService.delete(id).subscribe(() => {
      this.notificationService.success('Customer Deleted', '');
    });
  }
}
