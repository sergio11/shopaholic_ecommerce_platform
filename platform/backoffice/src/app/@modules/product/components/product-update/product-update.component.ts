import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { CategoryService } from 'src/app/@shared/services/category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from './../../../../@shared/services/product.service';
import { ICreateProduct } from 'src/app/@shared/interfaces/product.interface';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  @Input() data: any = {};
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<any>();

  productForm: FormGroup;
  mainImageFileSelected: File | undefined;
  secondaryImageFileSelected: File | undefined;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {
    this.productForm = this.fb.group({
      name: [''],
      description: [''],
      category: [''],
      stock: [''],
      price: [''],
      productCode: [''],
      brand: ['']
    });
  }

  ngOnInit(): void {
    this.loadMoreCategory();
    this.loadMoreBrands();
    console.log("Product update data", this.data);
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
    if (!this.productForm.value.name) {
      this.notificationService.error('You must provide a product name', '');
    } else {
      const productData: ICreateProduct = {
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
        .subscribe((data: any) => {
          console.log(data);
          this.notificationService.success('Product Updated successfully', '');
          this.dataChange.emit(data);
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
      .subscribe((data: any) => {
        this.isLoading = false;
        this.categoryOptionList = data.items;
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
      .subscribe((data: any) => {
        this.isLoading = false;
        this.brandOptionList = data.items;
        this.bPage++;
      });
  }
}
