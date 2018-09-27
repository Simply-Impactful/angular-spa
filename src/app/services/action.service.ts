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

  user = new User;
  dialogResult = '';
  length: number;
  errorMessage: string = '';

  public cognitoUtil: CognitoUtil;

  constructor(private http: HttpClient, private dialog: MatDialog) {
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
}
