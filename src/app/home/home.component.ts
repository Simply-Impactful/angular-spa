import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Group } from '../model/Group';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters } from '../services/parameters';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { ActionComponent } from '../action/action.component';
import { ActionService } from '../services/action.service';
import { AwsUtil } from '../services/aws.service';
import { LevelsMapping } from '../shared/levels-mapping';
import { LevelPopupComponent } from '../level-popup/level-popup.component';
import { LevelsEnum } from '../model/levelsEnum';
import { UserPermission } from '../services/user-permission.service';
import { ApiGatewayService } from '../services/api-gateway.service';

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
  levels = [];
  currLevel: string;
  levelPopupComp: LevelPopupComponent;

  constructor(
    private router: Router,
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private createProfileService: CreateProfileService,
    private params: Parameters, private lambdaService: LambdaInvocationService,
    public actionService: ActionService,
    public levelsMapping: LevelsMapping,
    public userPermission: UserPermission,
    public apiService: ApiGatewayService
  ) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
  }

  // LoggedInCallback interface
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      // get All the actions to parse the assignments
      // response in callbackWithParams method
      this.lambdaService.listActions(this);
      // kick off the levels data
      this.levelsMapping.getAllData();
    }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    if (result) {

      const cognitoUser = this.cognitoUtil.getCurrentUser();
      const params = new Parameters();
      this.user = params.buildUser(result, cognitoUser);
      // get all actions a user has taken and their points
      // response in callbackWithParameters method
      this.apiService.getUserActions(this, this.user);

    }
  }

  // Response of listActions API - logged in callback interface
  callbackWithParams(error: AWSError, result: any) {
    if (result) {
      const response = JSON.parse(result);
      const listOfActions = response.body;
      const listOfActionsLength = listOfActions.length;
      for (let i = 0; i < listOfActionsLength; i++) {
        if (listOfActions[i].assignmentUrl) {
          // for rendering the assignment and its corresponding name on the UI
          this.assignments.push(listOfActions[i].assignmentUrl);
          this.actionNames.push(listOfActions[i].name);
        }
      }
    }
  }

  // Response of getUserActions API - callback interface
  // Total points being captrued from response
  callbackWithParameters(error: AWSError, result: any) {
    if (result) {
      const response = result;
      const userActions = response;
      // if they haven't taken any actions...
      if (response.statusCode === 400) {
        this.user.totalPoints = 0;
        this.getLevelsData();
      } else {
        const userActionsLength = userActions.length;
        // if the user has taken actions
        if (userActionsLength > 0) {
          for (let i = 0; i < userActionsLength; i++) {
            this.user.totalPoints = userActions[i].totalPoints;
            this.getLevelsData();
          }
        }
      }
    }
    this.getLevelName(this.user.totalPoints);
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

  getLevelsData() {
    this.levelsMapping.getLevels().then(response => {
      // this should never hit
      if (response === 'levels not defined') {
        console.log('not defined');
        this.levelsMapping.getAllData();
        this.getLevelsData();
      } else {
        // timing issue
        this.user.level = this.levelsMapping.getUserLevel(this.user, response);
      }
    });
  }

  cognitoCallbackWithParam(result: any) { }

  callback() { }

  getLevelName(points: Number) {
    const levels = Object.keys(LevelsEnum).slice(0, 10);
    for (let i = 0; i < 10; i++) {
      if (this.user.totalPoints < Number(levels[i])) {
        this.currLevel = String(Object.values(LevelsEnum)[i]);
        break;
      }
    }
  }

}
