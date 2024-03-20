import { Component, OnInit } from '@angular/core';
import { UserInfoService } from './../../../../@shared/services/userInfo.service';
import { routesConstant } from 'src/app/@constant/routes.constant';
import { IUserInfoState } from 'src/app/@shared/stores/userinfo/userinfo.store';
import { UserInfoQuery } from 'src/app/@shared/stores/userinfo/userinfo.query';

@Component({
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  routesConstant = routesConstant;

  data: any = {}

  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly userInfoQuery: UserInfoQuery
    ) {}

  ngOnInit() {
    this.getUserInfo();
    this.userInfoQuery.select().subscribe((state: IUserInfoState) => {
      this.data = state;
    }); 
  }

  private async getUserInfo() {
    await this.userInfoService.getCurrentUserInfo().toPromise()
  }
}
