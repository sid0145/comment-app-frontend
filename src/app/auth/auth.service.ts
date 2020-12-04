import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { environment } from "../../environments/environment";
import { UserLgResp, UserSpResp } from "./auth.model";
import { MatSnackBar } from "@angular/material";

const BACKEND_URL = environment.apiUrl + "/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuthenticated: boolean = false;
  username: string;
  private token: string;
  tokenTimer: any;
  private authStatusListner = new Subject<boolean>();
  private userId: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}

  //providing user authenticated or not
  getIsAuth() {
    return this.isAuthenticated;
  }
  //getting all auth status as async at every event
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  //getting username
  getUsername() {
    return this.username;
  }

  //getting token
  getToken() {
    return this.token;
  }

  //get userid for authorization

  getUserId() {
    return this.userId;
  }

  //creating new user
  signUp(username: string, email: string, password: string) {
    const authData: UserSpResp = {
      username: username,
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string; username: string; userId: string }>(
        BACKEND_URL + "signup",
        authData
      )
      .subscribe(
        (result) => {
          this.toastr.success("signid up please login!", "success", {
            timeOut: 2000,
          });
          this.router.navigate(["/login"]);
        },
        (error) => {
          this.authStatusListner.next(false);
          this.isAuthenticated = false;
          this.toastr.error("oop's username and email should be unique!");
          this.router.navigate(["/signup"]);
        }
      );
  }

  //logiing user

  login(email: string, password: string) {
    const authData: UserLgResp = { email: email, password: password };
    this.http
      .post<{
        message: string;
        username: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + "login", authData)
      .subscribe(
        (result) => {
          this.username = result.username;
          const token = result.token;
          this.token = token;
          this.userId = result.userId;
          if (token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.snackBar.open(`Welcome ${result.username}`, "success", {
              duration: 2000,
            });
            this.toastr.success("login success", "success", {
              timeOut: 2000,
            });

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expirationDate,
              result.username,
              result.userId
            );
            this.isAuthenticated = true;
            this.authStatusListner.next(true);
            this.router.navigate(["/"]);
          }
        },
        (err) => {
          this.toastr.error(
            "please provide a valid username or password",
            "error",
            {
              timeOut: 2000,
            }
          );
          this.authStatusListner.next(false);
          this.isAuthenticated = false;
          this.router.navigate(["/login"]);
        }
      );
  }

  //setting duration for token
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  //saving data to the localStorage
  private saveAuthData(
    token: string,
    expirationDate: Date,
    username: string,
    userId: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
  }

  //clearing the localstorage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  }

  //getting the auth data
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate || !username || !userId) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      username: username,
      userId: userId,
    };
  }

  //automating the logout or setting token on particular time
  autoAuthUser() {
    const autoUserAuth = this.getAuthData();
    if (!autoUserAuth) {
      return;
    }
    const now = new Date();
    const expiresIn = autoUserAuth.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = autoUserAuth.token;
      this.isAuthenticated = true;
      this.username = autoUserAuth.username;
      this.userId = autoUserAuth.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  //logout implementation
  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.username = null;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.authStatusListner.next(false);
    this.toastr.info("logged out!");
    this.router.navigate(["/login"]);
  }
}
