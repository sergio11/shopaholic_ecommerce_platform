import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { CategoryService } from '../../../../@shared/services/category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from '../../../../@shared/services/product.service';
import { IProductCreate } from 'src/app/@shared/interfaces/product.interface';
@Component({
  selector: 'app-products-create',
  templateUrl: './products-create-component.html',
})
export class ProductsCreateComponent {

  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  isLoading = false;
  categoryOptionList: any[] = [];
  cPage = 1;
  brandOptionList: any[] = [];
  bPage = 1;
  mainImageFileSelected: File | undefined;
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
      this.productService.create(productData).subscribe((res: any) => {
        this.notificationService.success('Created', '');
        this.onClose.emit();
        this.productForm.reset();
      });
    }
  }

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
