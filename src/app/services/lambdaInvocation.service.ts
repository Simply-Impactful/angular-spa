import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Action } from '../model/Action';
import { User } from '../model/User';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import * as AWS from 'aws-sdk';
import { CognitoUtil, LoggedInCallback } from './cognito.service';
import { environment } from '../../environments/environment';
import { ActionService } from './action.service';

@Injectable()
export class LambdaInvocationService implements OnInit {

  public apiEndpoint: string = '';

  actionsSource = new BehaviorSubject(new Array<Action>());
  actions$ = this.actionsSource.asObservable();

  actionSource = new BehaviorSubject(new Action());
  action$ = this.actionSource.asObservable();

  action = new Action;
  userSource = new BehaviorSubject(new User());
  user$ = this.userSource.asObservable();
  // is this the best way to do this?
  user = new User;
  dialogResult = '';
  length: number;
  errorMessage: string = '';

  public cognitoUtil: CognitoUtil;

  constructor(private http: HttpClient, private dialog: MatDialog, public actionService: ActionService) {  }

  ngOnInit() {
  }

  openDialog(name: string) {
    this.action = this.actionService.getData(name);
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      width: '600px',
      //  data: {action:this.action}
    });
    this.actionSource.next(this.action);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }

  listActions(callback: LoggedInCallback) {
  //  AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = environment.region;
    AWS.config.update({ accessKeyId: environment.AWS_ACCESS_KEY_ID, secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      region: environment.region });

    const lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});
    const pullParams = {
      FunctionName: 'listActions',
      InvocationType: 'RequestResponse',
      LogType: 'None'
  };
    lambda.invoke(pullParams, function(error, data) {
      if (error) {
        callback.callbackWithParam(error, null);
      } else {
        callback.callbackWithParam(null, data.Payload);
      }
    });
  }
}
