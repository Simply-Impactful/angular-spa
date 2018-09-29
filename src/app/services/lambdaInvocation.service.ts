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

@Injectable()
export class LambdaInvocationService implements OnInit {

  public apiEndpoint: string = '';

  region = environment.region;

  apiVersion = '2015-03-31';

  lambda = new AWS.Lambda();

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

  constructor() {  }

  ngOnInit() {
  }

  listActions(callback: LoggedInCallback) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = this.region;
    this.lambda = new AWS.Lambda({region: this.region, apiVersion: this.apiVersion});
    const pullParams = {
      FunctionName: 'listActions',
      InvocationType: 'RequestResponse',
      LogType: 'None'
  };
    this.lambda.invoke(pullParams, function(error, data) {
      if (error) {
        callback.callbackWithParams(error, null);
      } else {
        callback.callbackWithParams(null, data.Payload);
      }
    });
  }

  performAction(callback: LoggedInCallback, user: User, action: Action) {
    const requestBody = {
      body: {
      username: user.username,
    actionTaken: action.name,
    email: user.email,
    pointsEarned: action.eligiblePoints,
    recordedFrequency: 1 }};
    console.log(JSON.stringify(requestBody));

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = this.region;
    this.lambda = new AWS.Lambda({region: this.region, apiVersion: this.apiVersion});
    const putParams = {
      FunctionName: 'createUserActions',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(requestBody)
    };

    this.lambda.invoke(putParams, function(error, data) {
      if (error) {
        console.log(error);
        callback.callbackWithParams(error, null);
      } else {
        console.log(data);
        callback.callbackWithParams(null, data.Payload);
      }
    });

  }
}
