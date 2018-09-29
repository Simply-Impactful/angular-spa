import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Action } from '../model/Action';
import { User } from '../model/User';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import * as AWS from 'aws-sdk';
import { CognitoUtil, LoggedInCallback, Callback } from './cognito.service';
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
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = environment.region;
  }

  listActions(callback: LoggedInCallback) {
    const lambda = new AWS.Lambda({region: AWS.config.region, apiVersion: '2015-03-31'});
    const pullParams = {
      FunctionName: 'listActions',
      InvocationType: 'RequestResponse',
      LogType: 'None'
    };
    lambda.invoke(pullParams, function(error, data) {
      if (error) {
        callback.callbackWithParams(error, null);
      } else {
        callback.callbackWithParams(null, data.Payload);
      }
    });
  }

  adminCreateAction(callback: Callback) {
    const lambda = new AWS.Lambda({region: AWS.config.region, apiVersion: '2015-03-31'});
    const pullParams = {
      FunctionName: 'listActions',
      InvocationType: 'RequestResponse',
      LogType: 'None'
    };
    lambda.invoke(pullParams, function(error, data) {
      if (error) {
        callback.callbackWithParam(error);
      } else {
        callback.callbackWithParam(data.Payload);
      }
    });
  }
}
