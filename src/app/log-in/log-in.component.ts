import { Component, OnInit } from '@angular/core';
import { LogInService } from '../services/log-in.service';
import { CognitoCallback, LoggedInCallback, ChallengeParameters } from '../services/cognito.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements LoggedInCallback, OnInit {

  errorMessage: string = "";
  username: string = "";
  password: string = "";

  constructor(public logInService: LogInService, public router: Router) { }

  ngOnInit() {
    this.errorMessage = null;
    console.log("Checking if the user is already authenticated. If so, then redirect to the home page");
    this.logInService.isAuthenticated(this);
  }

  login() {
    // Validate credentials and authentication
    this.logInService.authenticate(this.username, this.password, this);
  }

  // LoggedInCallback interface
  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (isLoggedIn) {
     // this.router.navigate(['/home']);
    }
  }
 // CognitoCallback interface
  cognitoCallback(message: string, result: any) {
    if (message != null) { //if there is an error
        this.errorMessage = message;
        console.log("result: " + this.errorMessage);
        if (this.errorMessage === 'User is not confirmed.') {
            console.log("redirecting");
        //    this.regService.confirmRegistration(this.email, this.confirmationCode, this);
           // this.router.navigate(['/home/confirmRegistration', this.email]);
        } else if (this.errorMessage === 'User needs to set password.') {
            console.log("redirecting to set new password");
           // this.router.navigate(['/home/newPassword']);
        }
    } else { //success
      //  this.ddb.writeLogEntry("login");
        this.router.navigate(['/home']);
    }
  }
  // CognitoCallback interface
  handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
    throw new Error("handleMFASetup Method not implemented.");
  }

}
