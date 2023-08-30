import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from './../../../../@shared/services/category.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
})
export class CategoryUpdateComponent implements OnInit {
  @Input() data: any = {};
  @Output() onUpdated = new EventEmitter<any>();

  isModalOpen = false;
  categoryImageFileSelected: File | undefined;
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("Init Update category component");
    this.categoryForm.patchValue({
      name: this.data.name,
      description: this.data?.department?.id
    });
  }

  onSubmit() {
    if (!this.categoryForm.value.name) {
      this.notificationService.error('Name are Empty', '');
    } else {
      this.categoryService
        .update(this.data.id, {
          name: this.categoryForm.value.name || '',
          description: this.categoryForm.value.description || '',
          image: this.categoryImageFileSelected,
        })
        .subscribe((res: any) => {
          console.log(res)
          this.notificationService.success('Updated', '');
        });
    }
  }
}
