import { Injectable, OnInit } from '@angular/core';
import { Action } from '../model/Action';
import { User } from '../model/User';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import * as AWS from 'aws-sdk';
import { CognitoUtil, LoggedInCallback } from './cognito.service';
import { environment } from '../../environments/environment';
import { LambdaInvocationService } from './lambdaInvocation.service';
import { AWSError } from 'aws-sdk';

@Injectable()
export class ActionService implements OnInit {

  public apiEndpoint: string = '';

  action = new Action;

  user = new User;
  dialogResult = '';
  length: number;
  errorMessage: string = '';
  actionRules: Action;
  maxFrequency: number;
  frequencyCadence: string;

  public cognitoUtil: CognitoUtil;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  checkCadences (action: Action) {
    console.log('actoin rules ' + JSON.stringify(action));
    this.maxFrequency = action.maxFrequency;
    this.frequencyCadence = action.frequencyCadence;
    console.log('this.actionRUles ' + this.maxFrequency + ' and ' + this.frequencyCadence);

  }

  openDialog(name: string, action: Action) {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      width: '600px',
        data: action
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void {
    // throw new Error('Method not implemented.');
   }

   callbackWithParams(error: AWSError, result: any): void {
   }
   callbackWithParam(result: any): void {
    // throw new Error('Method not implemented.');
   }
}
