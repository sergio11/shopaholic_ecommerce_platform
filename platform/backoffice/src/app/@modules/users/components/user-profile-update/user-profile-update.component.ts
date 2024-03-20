import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { UserInfoService } from './../../../../@shared/services/userInfo.service';
import { routesConstant } from './../../../../@constant/routes.constant';
import { UserInfoQuery } from 'src/app/@shared/stores/userinfo/userinfo.query';
import { IUserInfoState } from 'src/app/@shared/stores/userinfo/userinfo.store';

@Component({
  templateUrl: './user-profile-update.component.html',
  styleUrls: ['./user-profile-update.component.scss'],
})
export class UserProfileUpdateComponent implements OnInit {

  userInfo: any = {};
  routesConstant = routesConstant;
  userInfoForm: FormGroup;
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly userInfoService: UserInfoService,
    private readonly notification: NzNotificationService,
    private readonly router: Router,
    private readonly userInfoQuery: UserInfoQuery
  ) {
    this.userInfoForm = this.fb.group({});
  }

  //* Life cycles
  ngOnInit(): void {
    this.userInfoQuery.select().subscribe((state: IUserInfoState) => {
      this.userInfo = state;
      this.userInfoForm = this.fb.group({
        name: [this.userInfo?.name, Validators.required],
        lastname: [this.userInfo?.lastname, Validators.required],
        email: [this.userInfo?.email, Validators.required],
        city: [this.userInfo?.city, Validators.required],
        country: [this.userInfo?.country, Validators.required],
        birthDate: [this.userInfo?.birthDate, Validators.required],
        gender: [this.userInfo?.gender, Validators.required],
        language: [this.userInfo?.language, Validators.required]
      })
    }); 
  }

  onSubmit() {
   this.userInfoService
      .updateCurrentUserInfo(this.userInfoForm.value)
      .subscribe((data: any) => {
        this.notification.success('Profile Updated Successfully', '');
        this.router.navigate([routesConstant.userProfile]);
      });
  }
}
