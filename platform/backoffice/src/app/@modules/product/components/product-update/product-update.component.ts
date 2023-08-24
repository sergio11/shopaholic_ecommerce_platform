import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { CategoryService } from 'src/app/@shared/services/category.service';
import { DepartmentService } from 'src/app/@shared/services/department.service';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from './../../../../@shared/services/product.service';
import { IFProductCreate } from 'src/app/@shared/interfaces/product.interface';

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
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  mainImageFileSelected: File | undefined;
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


  ngOnInit(): void {
    this.loadMoreDepartment();
    this.loadMoreCategory();
    this.loadMoreBrands();
    this.productForm.patchValue({
      name: this.data?.name,
      description: this.data?.description,
      specification: this.data?.specification,
      stock: this.data?.stock,
      mrp: this.data?.mrp,
      mrpVat: this.data?.mrpVat,
      brand: this.data?.brand?.id,
      category: this.data?.category?.id,
      department: this.data?.department?.id,
      productCode: this.data?.productCode,
      isAvailable: this.data?.isAvailable,
      isNewArrival: this.data?.isNewArrival,
      isTopSelling: this.data?.isTopSelling,
      isFeatured: this.data?.isFeatured,
      isActive: this.data?.isActive,
      isPopular: this.data?.isPopular,
      isHot: this.data?.isHot,
      isNew: this.data?.isNew,
    });
  }

  onSubmitCreate() {
    if (!this.mainImageFileSelected) {
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
        productImages: '',
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
