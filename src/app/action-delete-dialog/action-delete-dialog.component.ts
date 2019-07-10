import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';


@Component({
  selector: 'app-action-delete-dialog',
  templateUrl: './action-delete-dialog.component.html',
  styleUrls: ['./action-delete-dialog.component.scss']
})
export class ActionDeleteDialogComponent implements OnInit, LoggedInCallback, Callback {
  action: Action;
  actions: Action[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Action,
  public thisDialogRef: MatDialogRef<ActionDeleteDialogComponent>,
  private lambdaService: LambdaInvocationService,
  private cognitoUtil: CognitoUtil) { }

  ngOnInit() {
    this.action = this.data;
    if (!this.action) {
      console.log('no data');
    }
    console.log(this.action);

    console.log(`${this.action.name}`);
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  onDeleteConfirm() {
    console.log('confirm action');
    const isError = false;
    const name = this.action.name;
    this.actions.push(this.action);
    console.log(name);
    this.lambdaService.adminDeleteAction(this.actions, this);
   }

   // API response of Create Actions
  callbackWithParameters(error: AWSError, result: any) {
    if (result) {
      console.log('result');
      console.log(`${result}`);
      this.thisDialogRef.close('Confirm');
      window.location.reload();
    } else {
      console.log('ERROR ' + error);
    }
  }
  // API response of list Actions
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
    }
  }
   // LoggedInCallback interface
  isLoggedIn(message: string, loggedIn: boolean): void { }
  callbackWithParam(result: any): void {}

    // Callback Interface
  callback() {}
  cognitoCallbackWithParam(result: any) {}
}
