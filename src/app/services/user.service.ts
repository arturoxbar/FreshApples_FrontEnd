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
  CREATE: "/api/v1/users/signup",
  LOGIN: "/api/v1/users/login",
  VALIDATE: "/api/v1/users/user",
  FORGOT1: "/api/v1/users/password/reset"
}

@Injectable()
export class UserService {
  private baseUrl = 'http://localhost:7338';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => error);
  }

  createUser(newUser: UserInterface) {
    const url = `${this.baseUrl}${ENDPOINTS.CREATE}`;
    return this.http.post(url, newUser).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(existingUser: ExistingUserInterface) {
    const url = `${this.baseUrl}${ENDPOINTS.LOGIN}`;
    return this.http.post(url, existingUser).pipe(
      catchError(this.handleError)
    );
  }

  validateUser(userInfo: string, code: string) {
    const url = `${this.baseUrl}${ENDPOINTS.VALIDATE}/${code}`;
    return this.http.patch(url, { userInfo }).pipe(
      catchError(this.handleError)
    )
  }

  sendResetPassword(userEmail: string) {
    const url = `${this.baseUrl}${ENDPOINTS.FORGOT1}`;
    return this.http.post(url, { email: userEmail }).pipe(
      catchError(this.handleError)
    )
  }
}
