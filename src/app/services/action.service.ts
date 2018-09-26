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

@Injectable()
export class ActionService implements OnInit {

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
  // public dynamoDb = new AWS.DynamoDB.DocumentClient();

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.apiEndpoint = 'https://ww27t3z96d.execute-api.us-east-1.amazonaws.com/cis/';
  }

  ngOnInit() {
  }

  openDialog(name: string) {
    this.action = this.getData(name);
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

  getData(name: string) {
    // Need to input this data into the DB from what the Admins upload
    // send GET request to DB to collect data for given action
    // placeholders...
    if (name === 'unplug') {
      this.action.name = 'unplug';
      this.action.eligiblePoints = 8;
      this.action.fact = 'Did you know? Americans use about 18 millions barrels of oil everyday';
      this.action.status = 'Elephant';
      this.action.imageUrl = '/assets/images/FossilFuelsFacts.jpg';
    }
    if (name === 'faucet') {
      this.action.name = 'faucet';
      this.action.eligiblePoints = 5;
      this.action.fact = 'You saved 10 liters of water today';
      this.action.status = 'Giraffe';
      this.action.imageUrl = '';
    }
    if (name === 'light') {
      this.action.name = 'light';
      this.action.eligiblePoints = 7;
      this.action.fact = 'You saved 10 watts today';
      this.action.status = 'Giraffe';
      this.action.imageUrl = '';
    }
    // mock response
    return this.action;
  }

  createAction() {

  }

  takeAction(action: Action): Observable<Action> {
    console.log('action in take action ' + JSON.stringify(action));
    this.actionSource.next(action);
    // log points
    const points = action.eligiblePoints;
    this.user.userPoints = this.user.userPoints + points;
    console.log('user points ======>' + this.user.userPoints);

    this.userSource.next(this.user); // user$ object
    return this.action$;
  }

  getActions(callback: LoggedInCallback) {
 //   AWS.config.update({region: 'us-east-1'});
  //  AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: identityPoolId});
    AWS.config.region = environment.region;
    AWS.config.update({ accessKeyId: environment.AWS_ACCESS_KEY_ID, secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      region: environment.region });

    const lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});
    let pullResults;
    const pullParams = {
      FunctionName: 'listActions',
      InvocationType: 'RequestResponse',
      LogType: 'None'
  };
    lambda.invoke(pullParams, function(error, data) {

      if (error) {
        console.log('error: ' + error);
      } else {
     //   pullResults = JSON.stringify(data.Payload);
        pullResults = data.Payload;
        callback.callbackWithParam(pullResults);
      }
    });

  /**   return this.http.get<Action[]>(this.apiEndpoint + 'actions')
     .pipe(
      map(response => {
        if (response) {
          this.length = response.length;
       //   const actionItem = response.filter((action) => action.hasOwnProperty('eligiblePoints'));
          this.actionsSource.next(response);
          return response;
        } else {
          console.log('error getting actions');
          this.errorMessage = 'Error getting Actions';
        }
      })); **/
  }
}
