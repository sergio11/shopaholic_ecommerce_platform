import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { CategoryService } from '../../../../@shared/services/category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from '../../../../@shared/services/product.service';
import { ICreateProduct } from 'src/app/@shared/interfaces/product.interface';
import { ICategory } from 'src/app/@shared/interfaces/category.interface';
import { IBrand } from 'src/app/@shared/interfaces/brand.interface';

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
  cPage = 1;
  bPage = 1;
  productForm: FormGroup;

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
  }

  onSubmitCreate() {
    if (!this.mainImageFileSelected) {
      this.notificationService.error('You must select a main product image', '');
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
