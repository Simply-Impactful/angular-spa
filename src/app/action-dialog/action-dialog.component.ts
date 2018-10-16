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

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: Action,
    public thisDialogRef: MatDialogRef<ActionDialogComponent>,
    private params: Parameters, private cognitoUtil: CognitoUtil,
    private lambdaService: LambdaInvocationService,
    private loginService: LogInService) { }

  ngOnInit() {
    this.lambdaService.listUsers(this);

    this.action = this.data;
    this.params.user$.subscribe(user => {
      this.user = user;
    });
    // get the user attributes that are set in the login service
    this.loginService.isAuthenticated(this, this.user);
  }

  onCloseConfirm() {
    this.lambdaService.performAction(this, this.user, this.action);
    this.thisDialogRef.close('Confirm');
  /**  if (this.actionService.checkCadences(this.action)) {
      this.lambdaService.performAction(this, this.user, this.action);
      this.thisDialogRef.close('Confirm');
    } else {
      // throw error
    } **/
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void {}

  // response of List users - LoggedInCallback interface
  callbackWithParams(error: AWSError, result: any): void {
    const uniqueEntriesByUser = [];
    if (result) {
      const response = JSON.parse(result);
      this.userActions = response.body;
      console.log('this.userActions.length ' + this.userActions.length);
      for (let i = 0; i < this.userActions.length; i++) {
        if (this.userActions[i]['username'] === this.user.username) {

          for (let index = 0; index < this.userActions[i].actionsTaken.length; index++ ) {
            console.log('userAction action taken name ' + JSON.stringify(this.userActions[i].actionsTaken[index].actionTaken));
            if (this.userActions[i].actionsTaken[index].actionTaken === this.action.name) {
              console.log('if.. PUSH');
              uniqueEntriesByUser.push(this.userActions[i].actionsTaken[index]);
         } else {
            // console.log('error pulling the Users data' + error);
          }
      }
    }
  }
  console.log('this.userActions... actionTaken' + JSON.stringify(uniqueEntriesByUser));
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
            const myObj =    {
              name: this.groupsResult[i].name,
              username: this.groupsResult[i].leader,
              description: this.groupsResult[i].description,
              zipCode: this.groupsResult[i].zipCode,
              groupAvatar: this.groupsResult[i].groupAvatar,
              groupType: this.groupsResult[i].groupType,
              groupSubType: this.groupsResult[i].groupSubType,
              pointsEarned: this.pointsEarned + this.groupsResult[i].members[j].pointsEarned,
              members: username
            };
            console.log('myObj ' + JSON.stringify(myObj));
            params.push(myObj);
            break;
          //   this.myGroups.push(this.groupsResult[i]);
          }
        }
      }
    }
    console.log('params ' + JSON.stringify(params));
    if (params.length > 0) {
      console.log('calling create gorup');
      // update points
      this.lambdaService.createGroup(params, this);
    }
   }

   // Perform Action API response - callback interface
   callbackWithParameters(error: AWSError, result: any) {
    if (result) {
   //   window.location.reload();
     // response goes to cognitoCallbackWithParam below - line 74
        this.lambdaService.getAllGroups(this);
    }
   }

    // response for create group API - CognitoCallback interface
    cognitoCallback(message: string, result: any) {
      if (result) {
        console.log('result of create group ' + result);
      }
    }

    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;

   callback() {}
}
