import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
})
export class BrandUpdateComponent implements OnInit {
  @Input() data: any = {};
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<any>();

  brandImageFileSelected: File | undefined;
  brandForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private brandService: BrandService
  ) {
    this.brandForm = this.fb.group({
      name: [''],
      slug: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.brandForm.patchValue({
      name: this.data.name,
      isFeatured: this.data.isFeatured,
      isActive: this.data.isActive,
      isPopular: this.data.isPopular,
      isHot: this.data.isHot,
      isNew: this.data.isNew,
    });
  }

  handleFileSelectedChange(file: any) {
    this.brandImageFileSelected = file;
  }

  onSubmit() {
    if (!this.brandImageFileSelected) {
      this.notificationService.error('Image Empty', '');
    } else if (!this.brandForm.value.name) {
      this.notificationService.error('Name Empty', '');
    } else {
      this.brandService
        .update(this.data?.id, {
          image: this.brandImageFileSelected,
          name: this.brandForm.value.name || '',
          slug: this.brandForm.value.slug || ''
        })
        .subscribe((res: any) => {
          console.log(res);
          this.notificationService.success('Updated', '');
          this.onClose.emit();
        });
    }
  }
}
