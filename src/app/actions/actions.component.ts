import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { LoggedInCallback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Parameters } from '../services/parameters';
import { User } from '../model/User';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, LoggedInCallback {
  username;
  userscore;
  unplugPoints;
  faucetPoints;
  lightsPoints;
  dialogResult = '';
  actionsLength: number;
  action: Action;
  eligiblePoints: number;
  user: User;

  actions: Action[];

  constructor(
    public dialog: MatDialog, public actionService: ActionService,
    public lambdaService: LambdaInvocationService, public params: Parameters) { }

  ngOnInit() {
    this.params.user$.subscribe(user => {
      this.user = user;
      this.userscore = this.user.userPoints;
    });
    // the value of the actions returned is stored as this.actions array object
    // in the callbackWithParams method
   this.lambdaService.listActions(this);
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
    // throw new Error('Method not implemented.');
   }
   callbackWithParams(error: AWSError, result: any): void {
     const response = JSON.parse(result);
     this.actions = response.body;
   }
  }
