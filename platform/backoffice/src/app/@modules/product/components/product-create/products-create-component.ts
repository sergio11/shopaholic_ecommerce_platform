import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { CategoryService } from '../../../../@shared/services/category.service';
import { DepartmentService } from 'src/app/@shared/services/department.service';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ProductService } from '../../../../@shared/services/product.service';
import { UtilsService } from 'src/app/@shared/services/utils.service';
import { IFProductCreate } from 'src/app/@shared/interfaces/product.interface';
@Component({
  selector: 'app-products-create',
  templateUrl: './products-create-component.html',
})
export class ProductsCreateComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private notificationService: NzNotificationService,
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}
  ngOnInit(): void {
    this.loadMoreDepartment();
    this.loadMoreCategory();
    this.loadMoreBrands();
  }
  //*Image update
  imageUploadLoading: boolean = false;
  imageUploadEndPoint = this.utilsService.uploadImageEndPoint;
  imageUrl: string = '';
  onChangeImageUpload(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.imageUploadLoading = true;
        break;
      case 'done':
        this.imageUploadLoading = false;
        this.imageUrl = info?.file?.response?.data?.link;
        break;
      case 'error':
        this.imageUploadLoading = false;
        break;
    }
  }
  //*Create
  productForm = this.fb.group({
    name: [''],
    description: [''],
    specification: [''],
    stock: [''],
    mrp: [''],
    mrpVat: [''],
    brand: [''],
    category: [''],
    department: [''],
    productCode: [''],
    isAvailable: [false],
    isNewArrival: [false],
    isTopSelling: [false],
    isFeatured: [false],
    isActive: [false],
    isPopular: [false],
    isHot: [false],
    isNew: [false],
  });
  onSubmitCreate() {
    if (!this.imageUrl) {
      this.notificationService.error('Image Empty', '');
    } else if (!this.productForm.value.name) {
      this.notificationService.error('Name Empty', '');
    } else {

      const productData: IFProductCreate = {
        name: this.productForm.value.name || '',
        description: this.productForm.value.description || '',
        isAvailable: this.productForm.value.isAvailable || false,
        isNewArrival: this.productForm.value.isNewArrival || false,
        isTopSelling: this.productForm.value.isTopSelling || false,
        mrp: this.productForm.value.mrp || '',
        mrpVat: this.productForm.value.mrpVat || '',
        productCode: this.productForm.value.productCode || '',
        specification: this.productForm.value.specification || '',
        stock: this.productForm.value.stock || '',
        brand: this.productForm.value.brand || '',
        category: this.productForm.value.category || '',
        department: this.productForm.value.department || '',
        isFeatured: this.productForm.value.isFeatured || false,
        isActive: this.productForm.value.isActive || false,
        isPopular: this.productForm.value.isPopular || false,
        isHot: this.productForm.value.isHot || false,
        isNew: this.productForm.value.isNew || false,
        productImages: this.imageUrl || '',
      };

      this.productService
        .create(productData)
        .subscribe((res: any) => {
          this.notificationService.success('Created', '');
          this.onClose.emit();
          this.productForm.reset();
          this.imageUrl = '';
        });
    }
  }
  //*Department
  departmentOptionList: any[] = [];
  isLoading = false;
  dPage = 1;
  loadMoreDepartment(): void {
    this.isLoading = true;
    this.departmentService
      .filter({ page: this.dPage, take: 10 })
      .subscribe((res: any) => {
        this.isLoading = false;
        this.departmentOptionList = res.data;
        this.dPage++;
      });
  }
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
