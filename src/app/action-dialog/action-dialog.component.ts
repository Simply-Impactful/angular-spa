import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { action } from '../model/action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  //user:User;
  action: action;
  constructor(public thisDialogRef: MatDialogRef<ActionDialogComponent>, public actionService:ActionService){}//, @Inject(MAT_DIALOG_DATA)public data: action) { }

  ngOnInit() {
    this.actionService.action$.subscribe(data=>{
      this.action = data;
    })

    console.log("this.action " + this.action);
  }

  onCloseConfirm(){
    /** TODO: addPoints() -- need to add this function, and we will need to pull in the user's 
     * points from the User Object. 
     * this.user.points = this.user.points + this.action.points;
     * the home page will have to subscribe to the User object in order to retrieve the points
     * just as we do above **/
    this.thisDialogRef.close('Confirm');

  }

  onCloseCancel(){
    this.thisDialogRef.close('Cancel');

  }

}
