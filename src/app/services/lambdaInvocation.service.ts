import { Injectable, OnInit } from '@angular/core';
import { Action } from '../model/Action';
import { User } from '../model/User';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import * as AWS from 'aws-sdk';
import { CognitoUtil, LoggedInCallback, Callback } from './cognito.service';
import { environment } from '../../environments/environment';
import { ActionService } from './action.service';
import { Buffer } from 'buffer';
import { HomeComponent } from '../home/home.component';
import { CreateProfileService } from '../services/create-profile.service';
import { CognitoUserAttribute, ICognitoUserAttributeData } from 'amazon-cognito-identity-js';
import { AWSError } from 'aws-sdk';
import { CreateGroupService } from '../services/creategroup.service';
import { LogInService } from '../services/log-in.service';


@Injectable()
export class LambdaInvocationService implements OnInit {

  region = environment.region;

  apiVersion = '2015-03-31';

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
          queryStringParameters:  {},
            pathParameters:  {
              username: user.username
        }
      })
    };
    lambda.invoke(pullParams, function(error, data) {
      if (error) {
        callback.callbackWithParams(error, null);
      } else {
     //   console.log('user action' + data.Payload);
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

//    const homeComponent = new HomeComponent(this.createGroupService, this.loginService, this.cognitoUtil,
 //     this.createProfileService, this.params);
    lambda.invoke(putParams, function(error, data) {
      if (error) {
        console.log(error);
        callback.callbackWithParams(error, null);
      } else {
        console.log(data);
    //    homeComponent.ngOnInit();
        callback.callbackWithParams(null, data.Payload);
      }
    });
  }
}
