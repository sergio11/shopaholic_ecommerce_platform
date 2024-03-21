import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ISaveUser } from 'src/app/@shared/interfaces/user.interface';
import { UserService } from 'src/app/@shared/services/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {

  @Input() data: any = {};
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  isModalOpen = false;
  userForm: FormGroup;
  imageFileSelected: File | undefined;

  constructor(
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly notificationService: NzNotificationService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      language: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userForm.patchValue({
      name: this.data.name,
      lastname: this.data.lastname,
      email: this.data.email,
      city: this.data.city,
      country: this.data.country,
      birthDate: this.data.birthDate,
      gender: this.data.gender,
      language: this.data.language
    });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.notificationService.error('Data Invalid', '');
    } else {
      const userData: ISaveUser = {
        id: this.data.id,
        name: this.userForm.value.name || '',
        lastname: this.userForm.value.lastname || '',
        email: this.userForm.value.email || '',
        phone: this.userForm.value.phone || '',
        language: this.userForm.value.language || '',
        country: this.userForm.value.country || '',
        city: this.userForm.value.city || '',
        image: this.imageFileSelected,
        birthDate: this.userForm.value.birthDate || '',
        gender: this.userForm.value.gender || '',
      };

      this.userService
      .updateUser(userData)
      .subscribe((data: any) => {
          this.notificationService.success('User Updated successfully', '');
          this.isModalOpen = false;
          this.dataChange.emit(data);
      });
    }
  }
}
