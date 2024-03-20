import { Component, OnInit } from '@angular/core';
import {
  IBaseFilterQuery
} from './../../@shared/interfaces/base.interface';

import { CategoryQuery } from '../../@shared/stores/categories/category.query';
import { CategoryService } from './../../@shared/services/category.service';
import { ICategoryState } from 'src/app/@shared/stores/categories/category.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {

  filterLoading = false;
  state: ICategoryState = createInitialState();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryQuery: CategoryQuery,
    private readonly notificationService: NzNotificationService
  ) {}

  ngOnInit() {
    this.filterData({ page: 1, take: 10 });
    this.categoryQuery.select().subscribe((state: ICategoryState) => {
      console.log(state)
      this.state = state;
    }); 
  }

  //* Filter
  
  async filterData(option: IBaseFilterQuery) {
    this.filterLoading = true;
    await this.categoryService.search(option).toPromise();
    this.filterLoading = false;
  }

  onChangePage(page: number) {
    this.filterData({ page, take: 10 });
  }

  onChangeSearch(e: any) {
    this.filterData({
      page: this.state.meta.currentPage,
      take: 10,
      searchTerm: e?.target?.value,
    });
  }

  //* Create
  isOpenCreateModal = false;
  onCloseCreateModal() {
    this.isOpenCreateModal = false;
  }
  onOpenCreateModal() {
    this.isOpenCreateModal = true;
  }

  //* Delete
  onDelete(id: string) {
    this.categoryService.delete(id).subscribe(() => {
      this.notificationService.success('Category Deleted', '');
    });
  }
}
