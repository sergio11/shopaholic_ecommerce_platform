import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { CategoryService } from 'src/app/@shared/services/category.service';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from './../../../../@shared/services/product.service';
import { IProductCreate } from 'src/app/@shared/interfaces/product.interface';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  @Input() data: any = {};
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<any>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  mainImageFileSelected: File | undefined;
  productForm = this.fb.group({
    name: [''],
    description: [''],
    category: [''],
    stock: [''],
    price: [''],
    productCode: [''],
    brand: ['']
  });


  ngOnInit(): void {
    this.loadMoreCategory();
    this.loadMoreBrands();
    this.productForm.patchValue({
      name: this.data?.name,
      description: this.data?.description,
      category: this.data?.category.id,
      stock: this.data?.stock,
      price: this.data?.price,
      productCode: this.data?.productCode,
      brand: this.data?.brand?.id
    });
  }

  onSubmitCreate() {
    if (!this.mainImageFileSelected) {
      this.notificationService.error('Image Empty', '');
    } else if (!this.productForm.value.name) {
      this.notificationService.error('Name Empty', '');
    } else {
      const productData: IProductCreate = {
        name: this.productForm.value.name || '',
        description: this.productForm.value.description || '',
        categoryId: this.productForm.value.category || '',
        stock: Number(this.productForm.value.stock),
        price: Number(this.productForm.value.price),
        productCode: this.productForm.value.productCode || '',
        brandId: this.productForm.value.brand || '',
      };

      this.productService
        .update(this.data?.id, productData)
        .subscribe((res: any) => {
          console.log(res);
          this.notificationService.success('Updated', '');
          this.onClose.emit();
        });
    }
  }

  isLoading = false;
  //*Category
  categoryOptionList: any[] = [];
  cPage = 1;
  loadMoreCategory(): void {
    this.isLoading = true;
    this.categoryService
      .search({ page: this.cPage, take: 10 })
      .subscribe((res: any) => {
        this.isLoading = false;
        this.categoryOptionList = res.data;
        this.cPage++;
      });
  }
  //*Brand
  brandOptionList: any[] = [];
  bPage = 1;
  loadMoreBrands(): void {
    this.isLoading = true;
    this.brandService
      .filter({ page: this.bPage, take: 10 })
      .subscribe((res: any) => {
        this.isLoading = false;
        this.brandOptionList = res.data;
        this.bPage++;
      });
  }
}
