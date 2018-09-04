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
    console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
    this.logInService.isAuthenticated(this);
  }

  login() {
    this.logInService.authenticate(this.username, this.password, this);
    // A service call will be made here to validate the credentials against what we have stored in the DB
  /**  this.logInService.login(this.username, this.password).subscribe(
      user => {
        if (user.isLoggedIn) {
          console.log("is logged in");
        }
      }); **/
  }

  // LoggedInCallback interface
  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }
 // CognitoCallback interface
  cognitoCallback(message: string, result: any): void {
    throw new Error("Method not implemented.");
  }
  // CognitoCallback interface
  handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
    throw new Error("Method not implemented.");
  }

}
