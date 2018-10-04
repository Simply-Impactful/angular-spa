import { Component, OnInit } from '@angular/core';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { Parameters} from '../services/parameters';
import { LogInService } from '../services/log-in.service';
import { User } from '../model/User';
import { AWSError } from 'aws-sdk';

@Component({
  selector: 'app-top-nav',
  templateUrl: './app-top-nav.component.html',
  styleUrls: ['./app-top-nav.component.scss']
})

export class AppTopNavComponent implements OnInit, LoggedInCallback {
  title: string = 'Change Is Simple';
  hideRightMenu: boolean = true;
  canSearch: boolean = false;
  userscore: number = 35;
  user: User;
  // comes from an API
//  searchGroups: string[] = ['Pink', 'Red', 'Purple'];

  constructor(private params: Parameters, private loginService: LogInService,
    private cognitoUtil: CognitoUtil) {}

  ngOnInit() {
    this.params.user$.subscribe(user => {
      this.user = user;
    });

    this.hideRightMenu = false;
    this.loginService.isAuthenticated(this, this.user);
  }
  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
    if (!this.user.picture) {
      this.user.picture = 'https://s3.amazonaws.com/simply-impactful-image-data/default-profile-pic.png';
    }
    console.log('this.user ' + JSON.stringify(this.user));
  }
    /** Interface needed for LoggedInCallback */
    isLoggedIn(message: string, isLoggedIn: boolean) {}
    // API Response
    callbackWithParams(error: AWSError, result: any) {}

}
