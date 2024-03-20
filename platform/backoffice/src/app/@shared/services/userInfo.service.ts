import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { UserInfoStore } from '../stores/userinfo/userinfo.store';
import { IUser } from '../interfaces/user.interface';

/**
 * Injectable service for managing user information.
 */
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  /** API endpoint for user-related operations. */
  private readonly END_POINT = `${environment.API_ENDPOINT}users/`;

  /**
   * Constructs a new UserInfoService instance.
   * @param http The HttpClient service for making HTTP requests.
   * @param userInfoStore The UserInfoStore service for managing user information state.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly userInfoStore: UserInfoStore,
  ) {}

  /**
   * Updates the current user's information.
   * @param payload The user information to be updated.
   * @returns An Observable that emits the response data after updating the user information.
   */
  updateCurrentUserInfo(payload: IUser) {
    return this.http.post(`${this.END_POINT}self`, payload).pipe(
      tap((data) => {
        this.userInfoStore.update(data);
      })
    );
  }

  /**
   * Retrieves the current user's information.
   * @returns An Observable that emits the current user's information.
   */
  getCurrentUserInfo() {
    return this.http.get(`${this.END_POINT}self`).pipe(
      tap((data) => {
        this.userInfoStore.update(data);
      })
    );
  }
}
