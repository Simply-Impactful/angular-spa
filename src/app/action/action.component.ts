import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  action = new Action();
  dialogResult = '';

  constructor(public dialog: MatDialog, public actionService: ActionService) { }

  ngOnInit() {

  }

  getData(type: string) {
    // send GET request to DB to collect data for given type
    // placeholders...
    if (type === 'unplug') {
      this.action.type = 'unplug';
      this.action.points = 8;
      this.action.fact = 'You saved 10 watts today';
      this.action.status = 'Elephant';
    }
    if (type === 'faucet') {
      this.action.type = 'faucet';
      this.action.points = 5;
      this.action.fact = 'You saved 10 liters of water today';
    }
    // mock response
    return this.action;
  }

  openDialog(type: string) {
    this.actionService.createAction(this.action).subscribe();
    this.action = this.getData(type);
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      width: '600px',
      //  data: {action:this.action}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }
}
