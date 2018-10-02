import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import { CreateGroupService } from '../services/creategroup.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { CognitoUserAttribute, ICognitoUserAttributeData } from 'amazon-cognito-identity-js';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback {
  user: User;
  userActions: User[];

  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;
  cognitoAttributes: ICognitoUserAttributeData[];


  constructor(
    private createGroupService: CreateGroupService,
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private createProfileService: CreateProfileService,
    private params: Parameters,
    private lambdaService: LambdaInvocationService ) { }

  ngOnInit() {
    // userscore = whatever is pulled from the db
   this.params.user$.subscribe(user => {
      this.user = user;
      this.user.userPoints = user.userPoints;
    });

    this.createGroupService.group$.subscribe(createdGroup => {
    this.group = createdGroup;
    });
    this.loginService.isAuthenticated(this, this.user);
   }

  /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {
  }
  // needed to persist the data returned from login service
  callbackWithParams(error: AWSError, result: any) {
    console.log('callback with params' + result);
    // const response = JSON.parse(result);
    this.userActions = result;
    const totalPoints = 0;
    console.log('user actions' + this.userActions);
    const userActionsLength = this.userActions.length;
    console.log( 'userAction Length' + userActionsLength);
     // for ( let i = 0; i < userActionsLength; i++ ) {
        // console.log ('' + i + this.userActions[i]);
     // }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    console.log('result of user attributes?' + JSON.stringify(result));
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.cognitoAttributes = result;
    this.user = params.buildUser(result, cognitoUser);
    this.lambdaService.getUserActions(this, this.user);

   }
}
