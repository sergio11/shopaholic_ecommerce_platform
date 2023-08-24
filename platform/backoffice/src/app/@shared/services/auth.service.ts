import { AuthCredential } from './../interfaces/auth.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { routesConstant } from 'src/app/@constant/routes.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  routesConstant = routesConstant;

  private readonly END_POINT = `${environment.API_ENDPOINT}auth/admin/`;

  constructor(private readonly http: HttpClient, private router: Router) {}

  adminSignIn(authCredential: AuthCredential) {
    return this.http.post(`${this.END_POINT}signin`, authCredential);
  }

  adminSignUp(authCredential: AuthCredential) {
    return this.http.post(`${this.END_POINT}signup`, authCredential);
  }

  getAuthorizationToken() {
    const token = localStorage.getItem('token');
    return token?.length ? String(token) : false;
  }

  isLoggedIn() {
    return Boolean(this.getAuthorizationToken());
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate([routesConstant.adminLogin]);
  }

  decodedToken() {
    const token: any = localStorage.getItem('token');
    return this.getAuthorizationToken() ? jwt_decode(token) : false;
  }
}
