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
import { Buffer } from 'buffer';

@Injectable()
export class LambdaInvocationService implements OnInit {

  public apiEndpoint: string = '';

  region = environment.region;

  apiVersion = '2015-03-31';

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
    AWS.config.region = environment.region;
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

  getUserActions(callback: LoggedInCallback, user: User) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = environment.region;
    const lambda = new AWS.Lambda({region: AWS.config.region, apiVersion: '2015-03-31'});
    const pullParams = {
      FunctionName: 'getUserActions',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload:  JSON.stringify({
          httpMethod:  'GET',
          path:  '/userActions',
          resource:  '',
          queryStringParameters:  {
                      },
            pathParameters:  {
              username: user.username
                            },
    })


    };
    lambda.invoke(pullParams, function(error, data) {
      if (error) {
        callback.callbackWithParams(error, null);
      } else {
        console.log('user action' + data.Payload);
        callback.callbackWithParams(null, data.Payload);
      }
    });
  }

  adminCreateAction(actionData: Action, callback: LoggedInCallback) {
    const JSON_BODY = {
      name: actionData.name,
      eligiblePoints: actionData.eligiblePoints,
      funFactImageUrl: actionData.funFactImageUrl,
      funFact: actionData.funFact,
      maxFrequency: actionData.maxFrequency,
      tileIconUrl: actionData.tileIconUrl,
      frequencyCadence: actionData.frequencyCadence
    };

    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = this.region;
    const lambda = new AWS.Lambda({region: this.region, apiVersion: this.apiVersion});
    const putParams = {
      FunctionName: 'createActions',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify({
        httpMethod: 'POST',
        path: '/actions',
        resource: '',
        queryStringParameters: {
        },
        pathParameters: {
        },
        body: body
      })
    };
    lambda.invoke(putParams, function(error, data) {
      if (error) {
        callback.callbackWithParams(error, null);
      } else {
        callback.callbackWithParams(null, data.Payload);
      }
    });
  }

  performAction(callback: LoggedInCallback, user: User, action: Action) {
    const cognitoUtil = new CognitoUtil;
    const JSON_BODY = {
      username: user.username,
      actionTaken: action.name,
      email: user.email,
      pointsEarned: action.eligiblePoints,
      recordedFrequency: 1
    };
    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
    AWS.config.region = this.region;
    const lambda = new AWS.Lambda({region: this.region, apiVersion: this.apiVersion});
    const putParams = {
      FunctionName: 'createUserActions',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify({
        httpMethod: 'POST',
        path: '/userActions',
        resource: '',
        queryStringParameters: {
        },
        pathParameters: {
        },
        body: body
      })
    };

    const addedPoints = JSON_BODY.pointsEarned;
    lambda.invoke(putParams, function(error, data) {
      if (error) {
        console.log(error);
        callback.callbackWithParams(error, null);
      } else {
    //    cognitoUtil.updateUserAttribute(callback, addedPoints, user);
        console.log(data);
        callback.callbackWithParams(null, data.Payload);
      }
    });
  }
}
