import { Component } from '@angular/core';
import { IFBannerFilter } from 'src/app/@shared/interfaces/banner.interface';
import { ProductService } from './../../../@shared/services/product.service';
import { ProductsQuery } from 'src/app/@shared/stores/products/products.query';
import { IProductState } from 'src/app/@shared/stores/products/products.store';
import { createInitialState } from 'src/app/@shared/stores/core/generic-crud-store';
import { CategoryService } from 'src/app/@shared/services/category.service';
import { BrandService } from 'src/app/@shared/services/brand.service';

@Component({
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  filterLoading = false;
  state: IProductState = createInitialState();

  constructor(
    private readonly productService: ProductService,
    private readonly productQuery: ProductsQuery,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService
  ) {}

  ngOnInit() {
    this.loadMoreCategory();
    this.loadMoreBrands();
    this.filterData({ page: 1, take: 20 });
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

  loadMoreCategory(): void {
    this.categoryService
      .search({ page: 1, take: 30 })
      .toPromise()
  }

  loadMoreBrands(): void {
    this.brandService
      .filter({ page: 1, take: 30 })
      .toPromise()
  }
}
