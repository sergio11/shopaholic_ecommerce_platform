import { Component, OnInit } from '@angular/core';

import { IFilterUser } from './../../../../@shared/interfaces/user.interface';
import { UserService } from 'src/app/@shared/services/user.service';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsersQuery } from 'src/app/@shared/stores/users/users.query';
import { IUserState } from 'src/app/@shared/stores/users/users.store';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  loading = false;
  state: IUserState = createInitialState();
  isOpenCreateModal = false;
  
  constructor(
    private readonly userService: UserService,
    private readonly usersQuery: UsersQuery,
    private readonly notificationService: NzNotificationService
    ) {}

  ngOnInit() {
    this.filterData({ page: 1, take: 10 });
    this.usersQuery.select().subscribe((state: IUserState) => {
      console.log(state)
      this.state = state;
    }); 
  }

  async filterData(option: IFilterUser) {
    this.loading = true;
    await this.userService.searchAdmins(option).toPromise();
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
      this.notificationService.success('Admin Deleted', '');
    });
  }

  onCloseCreateModal() {
    this.isOpenCreateModal = false;
  }
  
  onOpenCreateModal() {
    this.isOpenCreateModal = true;
  }
}
