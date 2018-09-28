import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { LoggedInCallback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';

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
  action = new Action();
  dialogResult = '';
  actionsLength: string = '';

  actions: Action[];

  constructor(
    public dialog: MatDialog, public actionService: ActionService, public lambdaService: LambdaInvocationService) { }

  ngOnInit() {
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

  openDialog(name: string) {
    this.actionService.actions$.subscribe(response => {
      this.actions = response;
    });
    console.log('Action result ' + JSON.stringify(this.actions));
   // this.action = this.getActionsData(name);
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      width: '600px',
      //  data: { action:this.action }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogResult = result;
    });
  }
  isLoggedIn(message: string, loggedIn: boolean): void {
    // throw new Error('Method not implemented.');
   }
   callbackWithParam(error: AWSError, result: any): void {
     const response = JSON.parse(result);
     this.actions = response.body;
     this.actionsLength = response.body.length;
     console.log('responseLength ' + this.actionsLength);
   }
  }
