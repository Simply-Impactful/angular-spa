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
  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;
  cognitoAttributes: ICognitoUserAttributeData[];
  isViewAll: boolean = false;
  isHomePage: boolean = true;

  constructor(
    private createGroupService: CreateGroupService,
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private createProfileService: CreateProfileService,
    private params: Parameters, private lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    console.log('on init');
   this.params.user$.subscribe(user => {
      this.user = user;
    });
    this.createGroupService.group$.subscribe(createdGroup => {
      this.group = createdGroup;
    });
    this.loginService.isAuthenticated(this, this.user);
   }

  /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {
  }
  // API Response for getUserActions
  callbackWithParams(error: AWSError, result: any) {
    const response = JSON.parse(result);
    const userActions = response.body;
    const userActionsLength = userActions.length;

      for ( let i = 0; i < userActionsLength; i++ ) {
        if (userActions[i].totalPoints) {
          this.user.userPoints = userActions[i].totalPoints;
     //     this.userPoints = Number(this.user.userPoints);
        }
    }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.cognitoAttributes = result;
    this.user = params.buildUser(result, cognitoUser);
    this.lambdaService.getUserActions(this, this.user);
   }

   // for switching back and forth between actions page
   save() {
     this.isViewAll = true;
     this.isHomePage = false;
    console.log('need to implement');
   }
    // for switching back and forth between actions
   backHome() {
    this.isHomePage = true;
    this.isViewAll = false;
  }
}
