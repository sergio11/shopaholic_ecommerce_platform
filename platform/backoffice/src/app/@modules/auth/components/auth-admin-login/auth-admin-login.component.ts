import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../../../@shared/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { routesConstant } from 'src/app/@constant/routes.constant';

@Component({
  templateUrl: './auth-admin-login.component.html',
  styleUrls: ['./auth-admin-login.component.scss'],
})
export class AuthAdminLoginComponent implements OnInit {
  readonly routesConstant = routesConstant;
  isLoading: boolean = false;
  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: ['admin@shopaholic.com', [Validators.required]],
      password: ['123456', [Validators.required]],
      remember: [true],
    });
  }
  submitForm(): void {
    const { email, password } = this.validateForm.value;
    this.isLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.authService
      .adminSignIn({ email: email, password: password })
      .subscribe((res: any) => {
        console.log(res)
        if (res?.token?.length) {
          localStorage.setItem('token', String(res.token.replace("Bearer ", "")));
          this.notification.success('Authentication Success', '');
          this.router.navigate([routesConstant.adminDashboard]);
        }
      });
    this.isLoading = false;
  }
}
