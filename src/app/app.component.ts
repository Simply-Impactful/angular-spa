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
  constructor(public loginService: LogInService, public router: Router, public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    console.log('is logged in: ' + isLoggedIn);
    if (isLoggedIn) {

      const currentUser = this.cognitoUtil.getCurrentUser();
      const username = currentUser.getUsername();
      // if a non-admin is trying to access an admin site,
      // force them to login, sign them out
      if (window.location.toString().includes('/admin') && username !== 'superUser') {
        this.router.navigate(['/login']);
        currentUser.signOut();
      }

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
    }

    // if they aren't logged in, and they aren't on the landing page, direct them to the login screen
    if (!isLoggedIn && !window.location.toString().includes('/landing')) {
    // this.router.navigate(['/login']);
        this.router.navigate(['/landing']);
    }
  }
  callbackWithParams(error: AWSError, result: CognitoUserAttribute[]) {
    console.log('result ' + result);
  }

  setAdmin() {
    this.isAdmin = true;
  }
  callbackWithParam(result: any): void {
    console.log('RESULT OF CALLBACK WITH PARAM - error?' + JSON.stringify(result));

    // throw new Error('Method not implemented.');
  }
}





