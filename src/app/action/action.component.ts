import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material' 

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {

  dialogResult = "";

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  openDialog(){
    let dialogRef = this.dialog.open( ActionDialogComponent, {
      width: '600px', 
      data: 'elephant'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    })  
  }
}
