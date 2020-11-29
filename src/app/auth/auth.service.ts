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
  private authStatusListner = new Subject<boolean>();
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
          this.isAuthenticated = true;
          this.username = result.username;
          this.authStatusListner.next(true);
          this.toastr.success("successfully created!");
          this.router.navigate(["/"]);
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
      .post<{ message: string; username: string; userId: string }>(
        BACKEND_URL + "login",
        authData
      )
      .subscribe(
        (result) => {
          this.username = result.username;
          this.snackBar.open(`Welcome Back ${result.username}`, "success", {
            duration: 2000,
          });
          this.toastr.success("login success", "success", {
            timeOut: 2000,
          });
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          this.router.navigate(["/"]);
        },
        (err) => {
          this.toastr.error("login faild", "error", {
            timeOut: 2000,
          });
          this.authStatusListner.next(false);
          this.isAuthenticated = false;
          this.router.navigate(["/login"]);
        }
      );
  }

  //logout implementation
  logout() {
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.toastr.info("logged out!");
    this.router.navigate(["/login"]);
  }
}
