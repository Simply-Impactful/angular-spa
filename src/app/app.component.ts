import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './services/aws.service';
import {LogInService} from "./services/log-in.service";
import {CognitoUtil, LoggedInCallback} from "./services/cognito.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, LoggedInCallback {
 
  constructor(public awsUtil: AwsUtil, public cognito: CognitoUtil, public loginService: LogInService) {
    console.log("AppComponent: constructor");
}
  
  ngOnInit() {
    console.log("AppComponent: Checking if the user is already authenticated");
    this.loginService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    console.log("AppComponent: the user is authenticated: " + isLoggedIn);
    let mythis = this;
    this.cognito.getIdToken({
        callback() {
        },
        callbackWithParam(token: any) {
            // Include the passed-in callback here as well so that it's executed downstream
           // console.log("AppComponent: calling initAwsService in callback.. here's the token: " + token)
           // mythis.awsUtil.initAwsService(null, isLoggedIn, token);
        }
    });
  }
} 





