import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface UserInterface {
  username: string;
  email: string;
  password: string;
}

export interface ExistingUserInterface {
  userInfo: string;
  password: string;
}

const ENDPOINTS = {
  CREATE: "/signup",
  LOGIN: "/login",
  VALIDATE: "/user",
  FORGOT1: "/password/reset",
  RESETPASSWORD: "/password/reset"
}

@Injectable()
export class UserService {
  private baseUrl = 'http://localhost:7338/';
  private prefix = 'api/v1/users'

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => error);
  }

  createUser(newUser: UserInterface) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.CREATE}`;
    return this.http.post(url, newUser).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(existingUser: ExistingUserInterface) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.LOGIN}`;
    return this.http.post(url, existingUser).pipe(
      catchError(this.handleError)
    );
  }

  validateUser(userInfo: string, code: string) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.VALIDATE}/${code}`;
    return this.http.patch(url, { userInfo }).pipe(
      catchError(this.handleError)
    )
  }

  sendResetPassword(userEmail: string) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.FORGOT1}`;
    return this.http.post(url, { email: userEmail }).pipe(
      catchError(this.handleError)
    )
  }

  verifyResetCode(userInfo: string, code: string) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.FORGOT1}/${code}`;
    return this.http.post(url, { userInfo }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(userInfo: string, newPassword: string) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.RESETPASSWORD}`;
    return this.http.patch(url, { userInfo, newPassword }).pipe(catchError(this.handleError))
  }

}
