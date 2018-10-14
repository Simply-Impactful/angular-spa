import { Component, OnInit } from '@angular/core';
import { LogInService } from '../services/log-in.service';
import {
  CognitoUtil,
  LoggedInCallback,
  ChallengeParameters
} from '../services/cognito.service';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AWSError } from 'aws-sdk';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements LoggedInCallback, OnInit {

  errorMessage: string = '';
  username: string = '';
  password: string = '';
  user: User;

  constructor(
    public logInService: LogInService,
    public router: Router,
    public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
    this.errorMessage = null;
    console.log('Checking if the user is already authenticated. If so, then redirect to the home page');
    this.logInService.isAuthenticated(this, this.user);

  }

  login() {
    // Validate credentials and authentication
    this.logInService.authenticate(this.username, this.password, this);
  }

  // LoggedInCallback interface
  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (isLoggedIn) {
      // will route to home page when authenticated is true
      // this.router.navigate(['/home']);
    } else {
       this.router.navigate(['/login']);
    }
  }

  forgotPass() {
    this.router.navigate(['/resetpass']);
    // this.logInService.forgotPassword();
  }

  // CognitoCallback interface
  cognitoCallback(message: string, result: any) {
    if (message !== null) { // if there is an error
      // use a local variable as opposed to an instance var.
      this.errorMessage = message;
      console.error('result: ' + this.errorMessage);
       if (this.errorMessage === 'User needs to set password.') {
        console.log('redirecting to set new password');
      }
    } else { // success
      const currentUser = this.cognitoUtil.getCurrentUser();
      const username = currentUser.getUsername();
      if (username === 'superUser') {
        this.router.navigate(['/adminaccesslanding']);
      } else {
        this.router.navigate(['/home']);
      }

    }
  }
  /** Interface required for LoggedInCallback */
  callbackWithParams(error: AWSError, result: CognitoUserAttribute[]) {}
  // CognitoCallback interface
  handleMFAStep?(
    challengeName: string,
    challengeParameters:
    ChallengeParameters, callback: (confirmationCode: string) => any): void {
    throw new Error('handleMFASetup Method not implemented.');
  }
  callbackWithParam(result: any): void {
    // throw new Error('Method not implemented.');
   }
}
