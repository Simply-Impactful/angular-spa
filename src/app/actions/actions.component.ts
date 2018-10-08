import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Parameters } from '../services/parameters';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, LoggedInCallback {
  username: string = '';
  userscore;
  unplugPoints;
  faucetPoints;
  lightsPoints;
  dialogResult = '';
  actionsLength: number;
  action: Action;
  eligiblePoints: number;
  user: User;
 // @Input() user: User;

  actions: Action[];

  constructor(
    public dialog: MatDialog, public actionService: ActionService,
    public lambdaService: LambdaInvocationService, public params: Parameters,
    public loginService: LogInService, public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
   this.params.user$.subscribe(user => {
      this.user = user;
      this.user.totalPoints = user.totalPoints;
    });

   this.lambdaService.listActions(this);

   // to get the user data that's diplayed across the top
   this.loginService.isAuthenticated(this, this.user);
  }

  add(action) { }
  // lists all actions in the DB - 3 details
  // for View All actions page
  // user standpoint. different table from getActionsData
  getPerformedActionsData() {
    // pass username and action name to determine the history/frequency
  }

  openDialog(name: string, action: Action) {
   // required for page render
    this.actionService.openDialog(name, action);
   // this.action = this.getActionsData(name);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
  }

  // response of lamdba list Actions API call
  callbackWithParams(error: AWSError, result: any): void {
    const response = JSON.parse(result);
    this.actions = response.body;
  }
  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
  }
}
