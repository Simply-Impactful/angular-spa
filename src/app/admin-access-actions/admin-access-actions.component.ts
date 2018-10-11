import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatButton, MatCheckbox, MatDialog} from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { LoggedInCallback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { Action } from '../model/Action';
import { AdminActionDialogComponent } from './../admin-action-dialog/admin-action-dialog.component';

@Component({
  selector: 'app-admin-access-actions',
  templateUrl: './admin-access-actions.component.html',
  styleUrls: ['./admin-access-actions.component.scss']
})

export class AdminAccessActionsComponent implements OnInit, LoggedInCallback {
 actions: Action[];
 deleteActions = new Array<Action>();
 action: Action;
 displayedColumns = ['edit', 'name', 'eligiblePoints',
 'maxFrequency', 'frequencyCadence', 'funFact', 'funFactImageUrl', 'tileIconUrl', 'carbonPoints', 'assignmentUrl', 'delete'];
 dataSource;
 selection = new SelectionModel<Action>(true, []);
 dialogResult = '';
 selectedRow = [];
 index = '';
 isDeleted: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService,
    public dialog: MatDialog) {
      this.setClickedRow = function(index) {
        this.index = index;
        this.selectedRow.push(index);
        console.log('this.selectedRow ' + JSON.stringify(this.selectedRow));
      };
    }

  ngOnInit() {
    this.appComp.setAdmin();
    this.lambdaService.listActions(this);
  }

  // needed for the constructor method to determine which row we are displaying current action data for
  setClickedRow(i: any) {}

  edit() {
    const dialogRef = this.dialog.open(AdminActionDialogComponent, {
      width: '650px',
      height: '675px',
      data: this.actions[this.index]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
      this.selection.clear();
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.actions.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.actions.forEach(row => this.selection.select(row));
  }

  create() {
    const dialogRef = this.dialog.open(AdminActionDialogComponent, {
      width: '650px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
    // does this work?
    this.selection.clear();
  }

  saveDelete() {
    // delete the selected row
    for (let i = 0; i < this.selectedRow.length; i++) {
      console.log('this.selectedRow.length ' + this.selectedRow.length);
      console.log('row to DELETE ' + JSON.stringify(this.actions[this.selectedRow[i]]));
      this.deleteActions.push(this.actions[this.selectedRow[i]]);
    }
    this.lambdaService.adminDeleteAction(this.deleteActions, this);
    this.isDeleted = true;
    // clear the selection.. does this work?
    this.selectedRow = null;
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // result of lambda listActions and Delete Actions API
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      console.log('result');
      const response = JSON.parse(result);
      this.actions = response.body;
      this.dataSource = new MatTableDataSource(this.actions);
      this.dataSource.paginator = this.paginator;
    } else {
      console.log('error ' + JSON.stringify(error));
    }
    if (this.isDeleted) {
        window.location.reload();
     }
  }
  callbackWithParam(result: any): void {}
}


