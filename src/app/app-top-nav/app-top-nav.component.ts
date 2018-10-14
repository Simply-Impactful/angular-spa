import { Component, OnInit } from '@angular/core';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { Parameters} from '../services/parameters';
import { LogInService } from '../services/log-in.service';
import { User } from '../model/User';
import { AWSError } from 'aws-sdk';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConf } from '../shared/conf/app.conf';

@Component({
  selector: 'app-top-nav',
  templateUrl: './app-top-nav.component.html',
  styleUrls: ['./app-top-nav.component.scss']
})

export class AppTopNavComponent implements OnInit, LoggedInCallback {
  private conf = AppConf;

  title: string = this.conf.appTitle;
  hideRightMenu: boolean = true;
  hideHome: boolean = false;
  user: User;

  constructor(private params: Parameters, private loginService: LogInService,
    private cognitoUtil: CognitoUtil, private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.params.user$.subscribe(user => {
      this.user = user;
    });

    if (window.location.toString().includes('landing')
          || window.location.toString().includes('createuser')) {
      this.hideRightMenu = true;
    } else {
      this.hideRightMenu = false;
    }
    if (window.location.toString().includes('home')) {
      this.hideHome = true;
    } else {
      this.hideHome = false;
    }

    this.loginService.isAuthenticated(this, this.user);
  }
  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
    if (!this.user.picture) {
      this.user.picture = this.conf.default.userProfile;
    }
  }
    /** Interface needed for LoggedInCallback */
    isLoggedIn(message: string, isLoggedIn: boolean) {}
    // API Response
    callbackWithParams(error: AWSError, result: any) {}

}
