import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ICreateUser } from 'src/app/@shared/interfaces/user.interface';
import { UserService } from 'src/app/@shared/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user-component.html',
})
export class CreateUserComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  
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
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      language: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (!this.userForm.valid) {
      this.notificationService.error('Data Invalid', '');
    } else {
      const userData: ICreateUser = {
        name: this.userForm.value.name || '',
        lastname: this.userForm.value.lastname || '',
        email: this.userForm.value.email || '',
        password: this.userForm.value.password || '',
        phone: this.userForm.value.phone || '',
        language: this.userForm.value.language || '',
        country: this.userForm.value.country || '',
        city: this.userForm.value.city || '',
        image: this.imageFileSelected,
        birthDate: this.userForm.value.birthDate || '',
        gender: this.userForm.value.gender || '',
      };

      this.userService
      .createUser(userData)
      .subscribe((data: any) => {
          this.notificationService.success('User Created successfully', '');
          this.userForm.reset();
          this.onClose.emit();
      });
    }
  }
}
