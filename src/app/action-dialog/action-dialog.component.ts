import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { ActionComponent } from '../action/action.component';
import { AppConf } from '../shared/conf/app.conf';
import { Group } from '../model/Group';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit, LoggedInCallback, Callback {

  action: Action;
  user: User;
  actionsResult: any;
  groupsResult: any;
  myGroups = [];
  private conf = AppConf;
  pointsEarned;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: Action,
    public thisDialogRef: MatDialogRef<ActionDialogComponent>,
    private params: Parameters, private cognitoUtil: CognitoUtil,
    private lambdaService: LambdaInvocationService,
    private loginService: LogInService) { }

  ngOnInit() {
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
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void {}

  // response from Perform Action API
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      window.location.reload();
     // response goes to cognitoCallbackWithParam below - line 74
   // TODO: Implemente  this.lambdaService.getAllGroups(this);
   }
  }

  // response of isAuthenticated - loggedInCall back interface
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
   }

   // response of getAllGroups - callback interface
   cognitoCallbackWithParam(result: any) {
    const response = JSON.parse(result);
    this.groupsResult = response.body;
    const username = this.cognitoUtil.getCurrentUser().getUsername();
    const params = [];
    // display only groups the logged in user is a member of
    for (let i = 0; i < this.groupsResult.length; i++) {
      if (this.groupsResult[i].members.length > 0) {
        console.log('not undefined');
        for (let j = 0; j < this.groupsResult[i].members.length; j++) {
          if (this.groupsResult[i].members[j]['member'] === username) {
            console.log('if');
            const myObj =    {
              name: this.groupsResult[i].name,
              username: this.groupsResult[i].leader,
              description: this.groupsResult[i].description,
              zipCode: this.groupsResult[i].zipCode,
              groupAvatar: this.groupsResult[i].groupAvatar,
              groupType: this.groupsResult[i].groupType,
              groupSubType: this.groupsResult[i].groupSubType,
              pointsEarned: this.pointsEarned,
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
     // TODO: implement this.lambdaService.createGroup(params, this);
    }
   }

   // callback interface
   callbackWithParameters(error: AWSError, result: any) {}

   callback() {}
}
