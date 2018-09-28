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
