import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CategoryService } from './../../../../@shared/services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category-component.html',
})
export class CreateCategoryComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  categoryImageFileSelected: File | undefined;
  categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("Init Create category component");
  }

  onSubmitCreateCategory() {
    if (!this.categoryImageFileSelected) {
      this.notificationService.error('Image Empty', '');
    } else if (!this.categoryForm.value.name) {
      this.notificationService.error('Name are empty', '');
    } else {
      this.categoryService
        .create({
          name: this.categoryForm.value.name || '',
          description: this.categoryForm.value.description || '',
          image: this.categoryImageFileSelected,
        })
        .subscribe((res: any) => {
          console.log(res);
          this.categoryImageFileSelected = undefined;
          this.categoryForm.reset();
          this.onClose.emit();
          this.notificationService.success('Category created successfully!', '');
        });
    }
  }
}
