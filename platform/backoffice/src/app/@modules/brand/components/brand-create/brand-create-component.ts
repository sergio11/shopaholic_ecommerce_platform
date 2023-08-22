import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BrandService } from 'src/app/@shared/services/brand.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create-component.html',
})
export class BrandCreateComponent {

  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  brandImageFileSelected: File | undefined;
  brandForm: FormGroup;

  constructor(
    private brandService: BrandService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService
  ) {
    this.brandForm = this.fb.group({
      name: [''],
      slug: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    console.log("Init Brand Create Component");
  }

  onSubmitCreate() {
    if (!this.brandImageFileSelected) {
      this.notificationService.error('Image Empty', '');
    } else if (!this.brandForm.value.name) {
      this.notificationService.error('Name Empty', '');
    } else {
      this.brandService
        .create({
          image: this.brandImageFileSelected,
          slug: this.brandForm.value.slug || '',
          name: this.brandForm.value.name || ''
        })
        .subscribe((res: any) => {
          console.log(res);
          this.notificationService.success('Created', '');
          this.onClose.emit();
          this.brandForm.reset();
          this.brandImageFileSelected = undefined;
        });
    }
  }
}
