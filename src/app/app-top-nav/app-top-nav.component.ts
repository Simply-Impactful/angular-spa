import { Component, OnInit, Input, Output } from '@angular/core';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { Parameters} from '../services/parameters';
import { LogInService } from '../services/log-in.service';
import { User } from '../model/User';
import { AWSError } from 'aws-sdk';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConf } from '../shared/conf/app.conf';
import { HomeComponent } from '../home/home.component';
import { AppComponent } from '../app.component';
import { LevelsMapping } from '../shared/levels-mapping';

@Component({
  selector: 'app-top-nav',
  templateUrl: './app-top-nav.component.html',
  styleUrls: ['./app-top-nav.component.scss']
})

export class AppTopNavComponent implements OnInit, LoggedInCallback {
  private conf = AppConf;

  title: string = this.conf.appTitle;
  hideRightMenu: boolean = true;
  user: User;
  isViewAll: boolean;
  routerLink: string;
  isAdmin: boolean;
  isOnLevelPage: boolean = false;

  constructor(private params: Parameters, private loginService: LogInService,
    private cognitoUtil: CognitoUtil, private route: ActivatedRoute,
    private homeComp: HomeComponent, private appComp: AppComponent) {}

  ngOnInit() {
      this.params.user$.subscribe(user => {
        this.user = user;
      });
    if (window.location.toString().includes('level')) {
      this.isOnLevelPage = true;
    }

 /**   // TODO: inclue logic for this on reset password?
    if (window.location.toString().includes('landing')
          || window.location.toString().includes('createuser')) {
      this.hideRightMenu = true;
    } else {
      this.hideRightMenu = false;
    }
    this.routerLink = '/home';
 **/
    this.isAdmin = this.appComp.isAdmin;
    this.loginService.isAuthenticated(this);
  }

  toggle() {
    this.homeComp.isHomePage = true;
    this.homeComp.isViewAll = false;
  }
  logout() {
    this.cognitoUtil.getCurrentUser().signOut();
  }
  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
 //   console.log('this.user ' + JSON.stringify(this.user));
    if (!this.user.picture) {
      this.user.picture = this.conf.default.userProfile;
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
      this.routerLink = '/home';
      this.title = 'Navigate to Home Page';
    }
  }
  // API Response
  callbackWithParams(error: AWSError, result: any) {}

}
