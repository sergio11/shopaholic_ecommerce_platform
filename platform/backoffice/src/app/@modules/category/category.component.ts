import { Component, NgZone, OnInit } from '@angular/core';
import {
  IBaseFilterResponse,
  IBaseFilterQuery
} from './../../@shared/interfaces/base.interface';

import { CategoryQuery } from '../../@shared/stores/categories/category.query';
import { CategoryService } from './../../@shared/services/category.service';

@Component({
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private categoryQuery: CategoryQuery,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.filterData({ page: 1, take: 10 });
    this.ngZone.runOutsideAngular(() => { 
      setTimeout(() => { 
        this.categoryQuery.select().subscribe((response: IBaseFilterResponse) => {
          this.categories = response;
        });
      });
    }); 
  }

  //* Filter
  filterLoading = false;
  categories: any = {
    data: [],
    page: 0,
    take: 0,
    total: 0,
  };
  async filterData(option: IBaseFilterQuery) {
    this.filterLoading = true;
    await this.categoryService.search(option).toPromise();
    this.filterLoading = false;
  }
  onChangePage(page: number) {
    this.filterData({ page, take: 10 });
  }
  onChangeSearch(e: any) {
    if (this.categories && this.categories.page !== undefined) {
      this.filterData({
        page: this.categories.page,
        take: 10,
        searchTerm: e?.target?.value,
      });
    }
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
    this.categoryService.delete(id).toPromise();
  }
}
