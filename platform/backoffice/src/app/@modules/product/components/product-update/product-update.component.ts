import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from './../../../../@shared/services/product.service';
import { ICreateProduct } from 'src/app/@shared/interfaces/product.interface';
import { CategoryQuery } from 'src/app/@shared/stores/categories/category.query';
import { BrandQuery } from 'src/app/@shared/stores/brands/brand.query';
import { ICategoryState } from 'src/app/@shared/stores/categories/category.store';
import { IBrandState } from 'src/app/@shared/stores/brands/brand.store';

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
  isLoading = false;
  categoryOptionList: any[] = [];
  brandOptionList: any[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly fb: FormBuilder,
    private readonly notificationService: NzNotificationService,
    private readonly categoryQuery: CategoryQuery,
    private readonly brandQuery: BrandQuery
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
    this.categoryQuery.select().subscribe((state: ICategoryState) => {
      this.categoryOptionList = state.items;
    }); 
    this.brandQuery.select().subscribe((state: IBrandState) => {
      this.brandOptionList = state.items;
    });
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
        mainImage: this.mainImageFileSelected,
        secondaryImage: this.secondaryImageFileSelected
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
}
