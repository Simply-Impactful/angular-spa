import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './services/aws.service';
import { LogInService } from './services/log-in.service';
import { CognitoUtil, LoggedInCallback } from './services/cognito.service';
import { User } from './model/User';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AWSError } from 'aws-sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, LoggedInCallback {

  isAdmin: boolean = false;
  user: User;
  constructor(public loginService: LogInService, public router: Router) { }

  ngOnInit() {
    if (this.loginService) {
    this.loginService.isAuthenticated(this, this.user);
    }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    const cognito = new CognitoUtil();
    const awsUtil = new AwsUtil(cognito);
   cognito.getIdToken({
      callback() {},
      callbackWithParameters(error: AWSError, result: any) {},
      cognitoCallbackWithParam(result: any) {},
      callbackWithParam(token: any) {
        // Include the passed-in callback here as well so that it's executed downstream
        awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
    if (!isLoggedIn && !window.location.toString().includes('/landing')) {
      this.router.navigate(['/login']);
    }
  }
  callbackWithParams(error: AWSError, result: CognitoUserAttribute[]) {
    console.log('result ' + result);
  }

  setAdmin() {
    this.isAdmin = true;
  }
  callbackWithParam(result: any): void {
    // throw new Error('Method not implemented.');
  }
}





