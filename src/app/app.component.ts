import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './services/aws.service';
import { LogInService } from './services/log-in.service';
import { CognitoUtil, LoggedInCallback } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, LoggedInCallback {

  isAdmin: boolean = false;
  constructor(
    public awsUtil: AwsUtil,
    public cognito: CognitoUtil,
    public loginService: LogInService) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    this.cognito.getIdToken({
      callback() {
      },
      callbackWithParam(token: any) {
        // Include the passed-in callback here as well so that it's executed downstream
        this.awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
  }

  setAdmin(){
    this.isAdmin = true;
    console.log("isAdmin");
  }
}





