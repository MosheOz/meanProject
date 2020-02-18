import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  isAuth = false;
  expirationTimeout: NodeJS.Timer;
  authStatus = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsUserAutheticated(){
    return this.isAuth;
  }

  getStatusListener() {
    return this.authStatus.asObservable();
  }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(result => console.log(result));
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };

    this.http
      .post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
      .subscribe(result => {
        const token = result.token;
        this.token = token;
        if (token) {
          this.isAuth = true;
          this.authStatus.next(true);
          const durationExpiration = result.expiresIn;
          this.expirationTimeout = setTimeout(() => {
            this.logout();
          }, durationExpiration * 1000);
          this.router.navigate(['/']);
        }
      });
  }
  logout(){
    this.token = null;
    this.isAuth = false;
    this.authStatus.next(false);
    clearTimeout(this.expirationTimeout);
    this.router.navigate(['/']);
  }
}
