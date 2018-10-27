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

  ngOnInit() {}

  // TODO: need to add logic for lifetime cadence
  checkCadences (uniqueEntriesByUser: Action[], action: Action, actionDialog: ActionDialogComponent): boolean {
    const createdInCadence = [];
    console.log('action rules ' + JSON.stringify(action));
    this.maxFrequency = action.maxFrequency;
    this.frequencyCadence = action.frequencyCadence;
    const offSet = this.getValueOfCadence(this.frequencyCadence);
    const currentDate = new Date();
    // converts timestamp into mm/dd/yyyy
    //  const dateOfAction = new Date(uniqueEntriesByUser[0].createdAt).toLocaleDateString('en-US');

    // need to get timestamp of current date minus allowed cadence
    // subtract the offSet from the currentDate to get timeRange
    const timeRange = (currentDate.getTime() - offSet);
    for (let i = 0; i < uniqueEntriesByUser.length; i++) {
      // if the last time they took it was within the cadence timeframe...
      if (uniqueEntriesByUser[i].createdAt > timeRange) {
        createdInCadence.push(uniqueEntriesByUser[i]);
      }
    }
    // if the amount of times they took the action is greater than or equal to the max frequency
    // OR the the offset is undefined (meaning lifetime cadence) AND the action array is greater than
    // or equal to 1, throw the error.
    if (createdInCadence.length >= this.maxFrequency || (!offSet && uniqueEntriesByUser.length >= 1)) {
      actionDialog.isError = true;
      return false;
    } else {
      return true;
    }
  }

  getValueOfCadence(frequencyCadence: string) {
    const cadences = {
      // gets the off-set in a timestamp
      perDay: (24 * 60 * 60 * 1000) * 1,
      perWeek: (24 * 60 * 60 * 1000) * 7,
      perYear: (24 * 60 * 60 * 1000) * 365,
      perLifetime: undefined
    };
    return cadences[frequencyCadence];
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
