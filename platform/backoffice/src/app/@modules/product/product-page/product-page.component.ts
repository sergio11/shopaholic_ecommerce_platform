import { Component } from '@angular/core';
import { IFBannerFilter } from 'src/app/@shared/interfaces/banner.interface';
import { ProductService } from './../../../@shared/services/product.service';
import { ProductsQuery } from 'src/app/@shared/stores/products/products.query';
import { IProductState } from 'src/app/@shared/stores/products/products.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';

@Component({
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  filterLoading = false;
  state: IProductState = createInitialState();

  constructor(
    private productService: ProductService,
    private productQuery: ProductsQuery
  ) {}


  ngOnInit() {
    this.filterData({ page: 1, take: 12 });
    this.productQuery.select().subscribe((state: IProductState) => {
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
  async filterData(option: IFBannerFilter) {
    this.filterLoading = true;
    await this.productService.search(option).toPromise();
    this.filterLoading = false;
  }

  onChangeSearch(e: any) {
    this.filterData({
      page: this.state.meta.currentPage,
      take: 10,
      searchTerm: e?.target?.value,
    });
  }

  onChangePage(page: any) {
    this.filterData({ page, take: 10 });
  }
}
