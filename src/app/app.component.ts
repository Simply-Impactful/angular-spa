import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './services/aws.service';
import { LogInService } from './services/log-in.service';
import { CognitoUtil, LoggedInCallback } from './services/cognito.service';
import { User } from './model/User';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AWSError } from 'aws-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, LoggedInCallback {

  isAdmin: boolean = false;
  user: User;
  constructor(public loginService: LogInService) { }

  ngOnInit() {
   // this.loginService.isAuthenticated(this, this.user);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    const cognito = new CognitoUtil();
    const awsUtil = new AwsUtil(cognito);
    cognito.getIdToken({
      callback() {
      },
      callbackWithParam(token: any) {
        // Include the passed-in callback here as well so that it's executed downstream
         awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
  }
  callbackWithParams(error: AWSError, result: CognitoUserAttribute[]) {
    console.log('result ' + result);
  }

  setAdmin() {
    this.isAdmin = true;
    console.log('isAdmin');
  }
}





