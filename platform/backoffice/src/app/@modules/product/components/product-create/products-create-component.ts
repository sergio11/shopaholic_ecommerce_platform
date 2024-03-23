import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from '../../../../@shared/services/product.service';
import { ICreateProduct } from 'src/app/@shared/interfaces/product.interface';
import { ICategory } from 'src/app/@shared/interfaces/category.interface';
import { IBrand } from 'src/app/@shared/interfaces/brand.interface';
import { CategoryQuery } from 'src/app/@shared/stores/categories/category.query';
import { BrandQuery } from '../../../../@shared/stores/brands/brand.query';
import { ICategoryState } from 'src/app/@shared/stores/categories/category.store';
import { IBrandState } from 'src/app/@shared/stores/brands/brand.store';

@Component({
  selector: 'app-products-create',
  templateUrl: './products-create-component.html',
})
export class ProductsCreateComponent {

  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  mainImageFileSelected: File | undefined;
  secondaryImageFileSelected: File | undefined;
  isLoading = false;
  categoryOptionList: ICategory[] = [];
  brandOptionList: IBrand[] = [];
  productForm: FormGroup;

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
  }

  onSubmitCreate() {
    if (!this.mainImageFileSelected) {
      this.notificationService.error('You must select a main product image', '');
    } else if (!this.productForm.value.category) {
      this.notificationService.error('You must select a category', '');
    } else if (!this.productForm.value.brand) {
      this.notificationService.error('You must select a brand', '');
    } else if (!this.secondaryImageFileSelected) {
      this.notificationService.error('You must select a secondary product image', '');
    } else if (!this.productForm.value.name) {
      this.notificationService.error('Name Empty', '');
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
      this.productService.create(productData).subscribe((res: any) => {
        this.notificationService.success('Product created successfully', '');
        this.onClose.emit();
        this.productForm.reset();
      });
    }
  }
}
