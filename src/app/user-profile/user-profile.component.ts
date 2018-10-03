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
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, LoggedInCallback {
  user: User;
  cognitoAttributes: ICognitoUserAttributeData[];
  isEditProfile: Boolean = false;
  isUserProfile: Boolean = true;
  updatedUser = new User();

  constructor(
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private params: Parameters, private lambdaService: LambdaInvocationService) { }

  ngOnInit() {
   this.params.user$.subscribe(user => {
      this.user = user;
    });

    this.loginService.isAuthenticated(this, this.user);
   }

  /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {
  }

  // API Response for any lambda calls
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

   // for switching back and forth between edit and read mode
   editProfile() {
    this.isUserProfile = false;
    this.isEditProfile = true;
  }
  // save and switch mode back to view
  userProfile() {
    this.isEditProfile = false;
    this.isUserProfile = true;
    const updatedString = JSON.stringify(this.updatedUser);
 //   console.log("updated[0] " + JSON.stringify(updatedString[0]));
    const object = JSON.parse(updatedString);
 //   console.log('object ' + JSON.stringify(object.address));
//    console.log("this.updatedUser[0] " + JSON.stringify(this.updatedUser[0]));
    this.cognitoUtil.updateUserAttribute(this, object);
  }
}
