import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean;
  username: string;
  private userAuthSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userAuthSubs = this.authService
      .getAuthStatusListner()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.username = this.authService.getUsername();
        console.log(this.userIsAuthenticated);
      });
  }

  //logout implementation
  onLogout() {
    this.authService.logout();
  }

  //destroying the subscription
  ngOnDestroy() {
    this.userAuthSubs.unsubscribe();
  }
}
