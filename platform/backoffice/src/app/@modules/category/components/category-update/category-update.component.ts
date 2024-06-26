import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from './../../../../@shared/services/category.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ICategory } from 'src/app/@shared/interfaces/category.interface';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
})
export class CategoryUpdateComponent implements OnInit {
  @Input() data: ICategory | undefined;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

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
      name: this.data?.name,
      description: this.data?.description
    });
  }

  onSubmit() {
    if (!this.categoryForm.value.name) {
      this.notificationService.error('Name are Empty', '');
    } else {
      this.categoryService
        .update(this.data?.id || '', {
          name: this.categoryForm.value.name || '',
          description: this.categoryForm.value.description || '',
          image: this.categoryImageFileSelected,
        })
        .subscribe((data: any) => {
          this.notificationService.success('Category Updated', '');
          this.isModalOpen = false;
          this.categoryImageFileSelected = undefined;
          this.dataChange.emit(data);
        });
    }
  }
}
