import { Component, OnInit, Output, Input } from '@angular/core';
import { Group } from '../model/Group';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback {
  group: Group;
  isViewAll: boolean = false;
  isHomePage: boolean = true;
  user: User;

  constructor(
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private createProfileService: CreateProfileService,
    private params: Parameters, private lambdaService: LambdaInvocationService) { }

  ngOnInit() {
   this.params.user$.subscribe(user => {
      this.user = user;
    });
    this.loginService.isAuthenticated(this, this.user);
   }

  /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {}

  // API Response for getUserActions - body null on first time user
  // Don't throw an error in that scenario
  callbackWithParams(error: AWSError, result: any) {
    if (result) {
      const response = JSON.parse(result);
      const userActions = response.body;
      const userActionsLength = userActions.length;
        for ( let i = 0; i < userActionsLength; i++ ) {
          if (userActions[i].totalPoints) {
            this.user.totalPoints = userActions[i].totalPoints;
          }
      }
    }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
    // get the user actions if they are authenticated
    this.lambdaService.getUserActions(this, this.user);
   }

   // for switching back and forth between actions page
   navigate() {
     this.isViewAll = true;
     this.isHomePage = false;
   }
    // for switching back and forth between actions
   backHome() {
    this.isHomePage = true;
    this.isViewAll = false;
  }
}
