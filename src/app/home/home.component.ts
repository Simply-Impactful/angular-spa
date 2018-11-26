import { Component, OnInit, Input, Output } from '@angular/core';
import { Group } from '../model/Group';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { ActionComponent } from '../action/action.component';
import { ActionService } from '../services/action.service';
import { AwsUtil } from '../services/aws.service';
import { LevelsMapping } from '../shared/levels-mapping';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback, Callback {
  group: Group;
  isViewAll: boolean = false;
  isHomePage: boolean = true;
  user: User;
  assignments = [];
  actionNames = [];

  constructor(
    private router: Router,
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private createProfileService: CreateProfileService,
    private params: Parameters, private lambdaService: LambdaInvocationService,
    public actionService: ActionService,
    public levelsMapping: LevelsMapping) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
  }

   // LoggedInCallback interface
   isLoggedIn(message: string, isLoggedIn: boolean) {
     if (!isLoggedIn) {
       this.router.navigate(['/login']);
     } else {
      const lambdaService = new LambdaInvocationService;
      lambdaService.listLevelData(this);
      this.params.user$.subscribe(user => {
        this.user = user;
      });
      // get the user actions for their total points
      this.lambdaService.listActions(this);
     }
   }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    if (result) {
      const cognitoUser = this.cognitoUtil.getCurrentUser();
      const params = new Parameters();
      this.user = params.buildUser(result, cognitoUser);
      // get the user actions if they are authenticated
      // gets the total points and the assignments they've taken
      this.lambdaService.getUserActions(this, this.user);
    }
   }
  
   // Response of listActions API - logged in callback interface
  callbackWithParams(error: AWSError, result: any) {
    if (result) {
      const response = JSON.parse(result);
      const listOfActions = response.body;
      const listOfActionsLength = listOfActions.length;
        for ( let i = 0; i < listOfActionsLength; i++ ) {
          if (listOfActions[i].assignmentUrl) {
            // for rendering the assignment and its corresponding name on the UI
            this.assignments.push(listOfActions[i].assignmentUrl);
            this.actionNames.push(listOfActions[i].name);
          }
      }
    }
  }

  // Response of getUerActions API - callback interface
  callbackWithParameters(error: AWSError, result: any) {
    if (result) {
      const response = JSON.parse(result);
      const userActions = response.body;
      const userActionsLength = userActions.length;
        for ( let i = 0; i < userActionsLength; i++ ) {
          if (userActions[i].totalPoints) {
            this.user.totalPoints = userActions[i].totalPoints;
          } else { // no result, most likely means they haven't taken any actions
          this.user.totalPoints = 0;
        }
      }
    }
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

  // response of listLevelData
  cognitoCallbackWithParam(result: any) {
    const lambdaService = new LambdaInvocationService();
    if (result) {
      const response = JSON.parse(result);
      if (response.statusCode != 200) {
        // retry
        lambdaService.listLevelData(this);
      } else {
        const levels = response.body;
        this.user.level= this.levelsMapping.getUserLevel(this.user, levels);
        if (!this.user.level) {
          lambdaService.listLevelData(this);
        }
      }
     }
  }

  callback() {}

}
