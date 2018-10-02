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
 displayedColumns = ['name', 'eligiblePoints', 'maxFrequency', 'frequencyCadence', 'funFact', 'funFactImageUrl', 'tileIconUrl', 'delete'];
 datasource = new MatTableDataSource(this.actions);
 selection = new SelectionModel<Action>(true, []);
 dialogResult = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.appComp.setAdmin();
    this.datasource.paginator = this.paginator;
    this.lambdaService.listActions(this);
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
      width: '800px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }

  save() {
    console.log('selection ' + JSON.stringify(this.selection));
  // only needed for the DELETE
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // result of lambda invoke
  callbackWithParams(error: AWSError, result: any): void {
    const response = JSON.parse(result);
    this.actions = response.body;
    console.log('result ' + JSON.stringify(this.actions));
    console.log('error ' + error);
  }
  callbackWithParam(result: any): void {}
}


