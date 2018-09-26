import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { LoggedInCallback } from '../services/cognito.service';

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

  actions: Action[];

  constructor(
    public dialog: MatDialog, public actionService: ActionService) { }

  ngOnInit() {
   // this.getActionsData('');
   this.actionService.getActions(this);

  }

  add(action) { }
  // lists all actions in the DB - 3 details
  // for View All actions page
  getAllActions() { }

  // actions data
  getActionsData(name: string) {
    // send GET request to DB to collect data for given type
    // get back all the metadata, get back the frequency and cadence allowed
    // placeholders...
    if (name === 'unplug') {
      this.action.name = 'unplug';
      this.action.eligiblePoints = 8;
      this.action.fact = 'You saved 10 watts today';
    }

    if (name === 'faucet') {
      this.action.name = 'faucet';
      this.action.eligiblePoints = 5;
      this.action.fact = 'You saved 10 liters of water today';
    }

    // get frequency
    this.getPerformedActionsData();
    // if the frequency is greater than allowed freq, give another popup
    // don't let them re-take the action
    // grey it out after they tried - for another session -- MVP1?

    // mock response
    return this.action;
  }

  // user standpoint. different table from getActionsData
  getPerformedActionsData() {
    // pass username and action name to determine the history/frequency
  }

  openDialog(name: string) {
    this.actionService.actions$.subscribe(response => {
      this.actions = response;
    });
    console.log('Action result ' + JSON.stringify(this.actions));
    this.action = this.getActionsData(name);
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
  callbackWithParam(result: any): void {
    console.log('result: ' + result);
    console.log('body: ' + result.body);
  //  throw new Error('Method not implemented');
  }
}
