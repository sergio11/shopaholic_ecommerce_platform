import { AuthCredential, RegisterAdmin } from './../interfaces/auth.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { routesConstant } from 'src/app/@constant/routes.constant';

/**
 * Injectable service for authentication-related operations.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Constant routes for navigation. */
  routesConstant = routesConstant;

  /** API endpoint for admin authentication. */
  private readonly END_POINT = `${environment.API_ENDPOINT}auth/admin/`;

  /**
   * Constructs a new AuthService instance.
   * @param http The HttpClient service for making HTTP requests.
   * @param router The Router service for navigation.
   */
  constructor(private readonly http: HttpClient, private router: Router) {}

  /**
   * Sends a POST request to sign in an admin user.
   * @param authCredential The authentication credentials of the admin user.
   * @returns An Observable that emits the response data after signing in.
   */
  adminSignIn(authCredential: AuthCredential) {
    return this.http.post(`${this.END_POINT}signin`, authCredential);
  }

  /**
   * Sends a POST request to sign up an admin user.
   * @param data The registration data of the admin user.
   * @returns An Observable that emits the response data after signing up.
   */
  adminSignUp(data: RegisterAdmin) {
    return this.http.post(`${this.END_POINT}signup`, data);
  }

  /**
   * Retrieves the authorization token from local storage.
   * @returns The authorization token if present, otherwise false.
   */
  getAuthorizationToken() {
    const token = localStorage.getItem('token');
    return token?.length ? String(token) : false;
  }

  /**
   * Checks if the admin user is logged in.
   * @returns True if the admin user is logged in, otherwise false.
   */
  isLoggedIn() {
    return Boolean(this.getAuthorizationToken());
  }

  /**
   * Logs out the admin user by clearing the local storage and navigating to the login page.
   */
  logout() {
    window.localStorage.clear();
    this.router.navigate([this.routesConstant.adminLogin]);
  }

  /**
   * Decodes the authorization token to get user information.
   * @returns The decoded token if the user is logged in, otherwise false.
   */
  decodedToken() {
    const token: any = localStorage.getItem('token');
    return this.getAuthorizationToken() ? jwt_decode(token) : false;
  }
}
