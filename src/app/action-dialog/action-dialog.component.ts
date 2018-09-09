import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<ActionDialogComponent>, @Inject(MAT_DIALOG_DATA)public data: string) { }

  ngOnInit() {
  }

  onCloseConfirm(){
    this.thisDialogRef.close('Confirm');

  }

  onCloseCancel(){
    this.thisDialogRef.close('Cancel');

  }

}
