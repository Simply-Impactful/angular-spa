import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { action } from '../model/action';
import { ActionService } from '../services/action.service';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  action: action;
  constructor(public thisDialogRef: MatDialogRef<ActionDialogComponent>, public actionService:ActionService){}//, @Inject(MAT_DIALOG_DATA)public data: action) { }

  ngOnInit() {
    this.actionService.action$.subscribe(data=>{
      this.action = data;
    })

    console.log("this.data " + this.action);
  }

  onCloseConfirm(){
    this.thisDialogRef.close('Confirm');

  }

  onCloseCancel(){
    this.thisDialogRef.close('Cancel');

  }

}
