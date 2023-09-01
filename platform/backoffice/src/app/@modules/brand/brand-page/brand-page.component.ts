import { BrandQuery } from './../../../@shared/stores/brands/brand.query';
import { BrandService } from './../../../@shared/services/brand.service';
import { Component } from '@angular/core';
import { IFBannerFilter } from 'src/app/@shared/interfaces/banner.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { IBrandState } from 'src/app/@shared/stores/brands/brand.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';

@Component({
  templateUrl: './brand-page.component.html',
})
export class BrandPageComponent {

  state: IBrandState = createInitialState();

  constructor(
    private brandService: BrandService,
    private brandQuery: BrandQuery,
    private nzNotificationService: NzNotificationService
  ) {}
  
  ngOnInit() {
    this.filterData({ page: 1, take: 10 });
    this.brandQuery.select().subscribe((state: IBrandState) => {
      console.log(state)
      this.state = state;
    });
  }

  //*Crate
  isCreateModalOpen = false;
  onCloseCreateModal() {
    this.isCreateModalOpen = false;
  }
  onOpenCreateModal() {
    this.isCreateModalOpen = true;
  }

  //*Filter
  filterData(option: IFBannerFilter) {
    this.brandService.filter(option).toPromise();
  }

  onChangeSearch(e: any) {
    this.filterData({
      page: this.state.meta.currentPage,
      take: this.state.meta.itemsPerPage,
      searchTerm: e.target.value,
    });
  }
  onChangePage(e: any) {
    this.filterData({
      page: e,
      take: this.state.meta.itemsPerPage,
    });
  }
}
