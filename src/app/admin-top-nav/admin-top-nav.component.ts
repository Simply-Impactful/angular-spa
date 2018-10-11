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

  constructor(private params: Parameters, private loginService: LogInService,
    private cognitoUtil: CognitoUtil) {
  }

  ngOnInit() {
    this.hideRightMenu = false;
    this.params.user$.subscribe(user => {
      this.user = user;
    });
    this.loginService.isAuthenticated(this, this.user);

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
    isLoggedIn(message: string, isLoggedIn: boolean) {}
    // API Response
    callbackWithParams(error: AWSError, result: any) {}


}
