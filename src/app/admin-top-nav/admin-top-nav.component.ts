import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Parameters } from '../services/parameters';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { User } from '../model/User';
import { AWSError } from 'aws-sdk';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'admin-top-nav',
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.scss']
})

export class AdminTopNavComponent implements OnInit, LoggedInCallback {
  hideRightMenu: boolean = true;
  canSearch: boolean = false;
  activatedRoute: ActivatedRoute;
  user: User;
  routerLink: string;
  title: string;

  constructor(private params: Parameters, private loginService: LogInService,
    private cognitoUtil: CognitoUtil) {
  }

  ngOnInit() {
    this.hideRightMenu = true;
    this.params.user$.subscribe(user => {
      this.user = user;
    });
    this.loginService.isAuthenticated(this);

    // TODO: https://stackoverflow.com/questions/43118592/angular-2-how-to-hide-nav-bar-in-some-components
  }
   // response of isAuthenticated method in login service
   callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
    if (!this.user.picture) {
      this.user.picture = 'https://s3.amazonaws.com/simply-impactful-image-data/default-profile-pic.png';
    }
  }
    /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    // only expose the right menu if the user is logged in
    // only let the user route to the home page when clicking the nav icon if they're logged in
    if (!isLoggedIn) {
      this.hideRightMenu = true;
      this.routerLink = '/login';
      this.title = 'Navigate to Login Page';
    } else {
      this.hideRightMenu = false;
      this.routerLink = '/adminaccesslanding';
      this.title = 'Navigate to Admin Home Page';
    }
  }
  logout() {
    this.cognitoUtil.getCurrentUser().signOut();
  }
    // API Response
    callbackWithParams(error: AWSError, result: any) {}


}
