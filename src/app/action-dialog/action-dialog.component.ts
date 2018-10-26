import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil, LoggedInCallback, Callback, CognitoCallback, ChallengeParameters } from '../services/cognito.service';
import { ActionComponent } from '../action/action.component';
import { AppConf } from '../shared/conf/app.conf';
import { Group } from '../model/Group';
import * as _ from 'lodash';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit, LoggedInCallback, Callback, CognitoCallback {

  action: Action;
  user: User;
  actionsResult: any;
  groupsResult: any;
  myGroups = [];
  private conf = AppConf;
  pointsEarned;
  dialog: MatDialog;
  private actionService = new ActionService(this.dialog);
  userActions = [];
  uniqueEntriesByUser = [];
  displayAssignment = false;
  isError = false;
  displayCadence: string = 'per day';

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: Action,
    public thisDialogRef: MatDialogRef<ActionDialogComponent>,
    private params: Parameters, private cognitoUtil: CognitoUtil,
    private lambdaService: LambdaInvocationService,
    private loginService: LogInService) { }

  ngOnInit() {
    // required to get the userActions table - for cadences and frequences
    // response goes to callbackWithParams
    this.lambdaService.listUsers(this);

    // passed into the constructor of the dialog window from action(s).component.ts
    this.action = this.data;
    this.params.user$.subscribe(user => {
      this.user = user;
    });
    // get the user attributes that are set in the login service
    this.loginService.isAuthenticated(this);

    this.getDisplayText(this.action);
  }

  getDisplayText(action: Action) {
    let cadence = action.frequencyCadence;
    cadence.replace(/\'sper'+/g, 'per ');
    cadence = cadence.toLowerCase();
  }

  onCloseConfirm() {
    if (this.action.assignmentUrl) {
      this.displayAssignment = true;
    }
    if (this.actionService.checkCadences(this.uniqueEntriesByUser, this.action, this)) {
      this.lambdaService.performAction(this, this.user, this.action);
    } else {
      // throw error pop up window
    }
  }

  // when the user clicks Done after they are displayed the assignment
  closeWindow() {
    this.thisDialogRef.close('Confirm');
    window.location.reload();
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void {}

  // response of List users - LoggedInCallback interface
  // capture the frequencie cadence for my actions taken
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.userActions = response.body;
      for (let i = 0; i < this.userActions.length; i++) {
        if (this.userActions[i]['username'] === this.user.username) {

          for (let index = 0; index < this.userActions[i].actionsTaken.length; index++ ) {
            if (this.userActions[i].actionsTaken[index].actionTaken === this.action.name) {
              this.uniqueEntriesByUser.push(this.userActions[i].actionsTaken[index]);
         }
      }
    }
  }
 }
}

  // response of isAuthenticated - loggedInCall back interface
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
   }

   // response of getAllGroups - callback interface
   // update group points for the group member logged in
   cognitoCallbackWithParam(result: any) {
    const response = JSON.parse(result);
    this.groupsResult = response.body;
    const username = this.cognitoUtil.getCurrentUser().getUsername();
    const params = [];
    this.pointsEarned = Number(this.action.eligiblePoints);
    // display only groups the logged in user is a member of
    for (let i = 0; i < this.groupsResult.length; i++) {
      if (this.groupsResult[i].members.length > 0) {
        for (let j = 0; j < this.groupsResult[i].members.length; j++) {

          if (this.groupsResult[i].members[j]['member'] === username) {
            // need to define this for first time users in a group
            if (!this.groupsResult[i].members[j].pointsEarned) {
              this.groupsResult[i].members[j].pointsEarned = 0;
            }
            const myObj =    {
              name: this.groupsResult[i].name,
              username: this.groupsResult[i].leader,
              description: this.groupsResult[i].description,
              zipCode: this.groupsResult[i].zipCode,
              groupAvatar: this.groupsResult[i].groupAvatar,
              groupType: this.groupsResult[i].groupType,
              groupSubType: this.groupsResult[i].groupSubType,
              pointsEarned: this.pointsEarned + this.groupsResult[i].members[j].pointsEarned,
              membersString: username
            };
            params.push(myObj);
            break;
          }
        }
      }
    }
    if (params.length > 0) {
      // last step: update points - response of create group goes to callbackWithParameters line 145
      this.lambdaService.createGroup(params, this);
    }
   }

   // Perform Action API response - callback interface
   callbackWithParameters(error: AWSError, result: any) {
    if (result) {
     // response goes to cognitoCallbackWithParam above, line 105
        this.lambdaService.getAllGroups(this);
    }
   }

    // response for create group API - CognitoCallback interface
    cognitoCallback(message: string, result: any) {
      if (result) {
        // to reload the window when there is no assignment associated with action
        if (!this.displayAssignment) {
          window.location.reload();
        }
      }
    }

    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;

   callback() {}
}
