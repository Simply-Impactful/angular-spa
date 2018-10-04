import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, LoggedInCallback {
  user: User;
  isEditProfile: Boolean = false;
  isViewProfile: Boolean = true;
  updatedUser = new User();
  errorMessage: string = '';

  constructor(
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private params: Parameters, private lambdaService: LambdaInvocationService,
    public router: Router) { }

  ngOnInit() {
    console.log('on init');
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
    if (error) {
      this.errorMessage = error.message;
    }
    const response = JSON.parse(result);
    const userActions = response.body;
    const userActionsLength = userActions.length;

      for ( let i = 0; i < userActionsLength; i++ ) {
        if (userActions[i].totalPoints) {
          this.user.userPoints = userActions[i].totalPoints;
        }
    }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
    this.lambdaService.getUserActions(this, this.user);
   }

   // for switching back and forth between edit and read mode
   editProfile() {
    this.isViewProfile = false;
    this.isEditProfile = true;
  }
  // save and switch mode back to view
  saveChanges() {
    for (const key of Object.keys(this.updatedUser)) {
      if (this.updatedUser[key]) {
        this.cognitoUtil.updateUserAttribute(this, key, this.updatedUser[key]);
      }
    }
    // sets booleans back to defaults
    // refreshes component for changes to be visible
    window.location.reload();
  }
  backHome() {
    this.router.navigate(['/home']);
  }
}
