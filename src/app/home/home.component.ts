import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import { CreateGroupService } from '../services/creategroup.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AWSError } from 'aws-sdk';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback {
  user: User;
  userCopy: User;

  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;

  constructor(
    private createGroupService: CreateGroupService,
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private createProfileService: CreateProfileService,
    private params: Parameters) { }

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
   // console.log('is logged in');
  }
  // needed to persist the data returned from login service
  callbackWithParams(error: AWSError, result: CognitoUserAttribute[]) {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
  }

  // leave this for the builder to pass
  save() {

  }
}
