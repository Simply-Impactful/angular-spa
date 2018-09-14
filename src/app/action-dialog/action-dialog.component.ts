import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  action: Action;
  user: User;
  constructor(
    public thisDialogRef: MatDialogRef<ActionDialogComponent>,
    public actionService: ActionService) { }
  // ,@Inject(MAT_DIALOG_DATA)public data: action) { }

  ngOnInit() {
    this.actionService.action$.subscribe(data => {
      this.action = data;
    });
  }

  onCloseConfirm() {
    // sends points to DB for action taken
    // parameters: username, name, count --> how do we persist count?
    // createAction(){}
    /* TODO: addPoints() -- need to add this function, and we will need to pull in the user's
     * points from the User Object.
     * this.user.points = this.user.points + this.action.points;
     * the home page will have to subscribe to the User object in order to retrieve the points
     * just as we do above **/
    this.actionService.takeAction(this.action).subscribe(response=>{
      this.action = response;
    });
    this.thisDialogRef.close('Confirm');
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

}
