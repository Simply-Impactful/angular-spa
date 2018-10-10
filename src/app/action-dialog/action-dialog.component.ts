import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit, LoggedInCallback {

  action: Action;
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: Action,
    public thisDialogRef: MatDialogRef<ActionDialogComponent>,
    private params: Parameters, private cognitoUtil: CognitoUtil,
    private lambdaService: LambdaInvocationService, private loginService: LogInService) { }

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

  // response from perform action API
  callbackWithParams(error: AWSError, result: any): void {
     // if perform action is successful, reload the page so the numbers update
    if (result) {
    //  window.location.reload();
    // call get Groups, if they exist, then call create groups
    }
  }

  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
   }
}
