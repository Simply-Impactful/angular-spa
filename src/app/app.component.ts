import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './services/aws.service';
import { LogInService } from './services/log-in.service';
import { CognitoUtil, LoggedInCallback } from './services/cognito.service';
import { User } from './model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, LoggedInCallback {

  isAdmin: boolean = false;
  user: User;
  constructor(
    public cognito: CognitoUtil,
    public awsUtil: AwsUtil,
    public loginService: LogInService) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this, this.user);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    this.cognito.getIdToken({
      callback() {
      },
      callbackWithParam(token: any) {
        console.log(this.awsUtil);
        // Include the passed-in callback here as well so that it's executed downstream
        // this.awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
  }

  setAdmin() {
    this.isAdmin = true;
    console.log('isAdmin');
  }
}





