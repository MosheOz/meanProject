import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.baseUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  isAuth = false;
  expirationTimeout: any;
  userId: string;
  authStatus = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsUserAutheticated() {
    return this.isAuth;
  }

  getStatusListener() {
    return this.authStatus.asObservable();
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      result => this.router.navigate(["/"]),
      error => this.authStatus.next(false)
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(result => {
        const token = result.token;
        this.token = token;
        if (token) {
          this.isAuth = true;
          this.userId = result.userId;
          this.authStatus.next(true);
          const durationExpiration = result.expiresIn;
          this.setAuthTimer(durationExpiration);

          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + durationExpiration * 1000
          );
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      error => this.authStatus.next(false));
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.userId = null;
    this.authStatus.next(false);
    clearTimeout(this.expirationTimeout);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const isInFuture = authData.expiration.getTime() - now.getTime();
    if (isInFuture > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.isAuth = true;
      this.authStatus.next(true);
      this.setAuthTimer(isInFuture / 1000);
    }
  }

  private setAuthTimer(duration: number) {
    console.log('timer set: ', duration);
    this.expirationTimeout = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expiration: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration) {
      return;
    }
    return {
      token,
      expiration: new Date(expiration),
      userId
    };
  }
}
