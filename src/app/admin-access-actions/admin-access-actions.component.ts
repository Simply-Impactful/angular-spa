import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatButton, MatCheckbox, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { Action } from '../model/Action';
import { AdminActionDialogComponent } from './../admin-action-dialog/admin-action-dialog.component';
import { Parameters} from '../services/parameters';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-admin-access-actions',
  templateUrl: './admin-access-actions.component.html',
  styleUrls: ['./admin-access-actions.component.scss']
})

export class AdminAccessActionsComponent implements OnInit, LoggedInCallback {
  actions: Action[];
  action: Action;
  displayedColumns = ['edit', 'name', 'eligiblePoints',
    'maxFrequency', 'frequencyCadence', 'funFact', 'funFactImageUrl', 'tileIconUrl', 'carbonPoints', 'assignmentUrl', 'delete'];
  dataSource;
  dialogResult = '';
  isDeleted: boolean = false;
  user: User;

  allowMultiSelect = true;
  initialSelection = [];
  selection = new SelectionModel<Action>(this.allowMultiSelect, this.initialSelection);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService,
    public dialog: MatDialog, public cognitoUtil: CognitoUtil,
    public params: Parameters, public loginService: LogInService) { }

  ngOnInit() {
    this.params.user$.subscribe(user => {
      this.user = user;
    });
    this.appComp.setAdmin();

    this.loginService.isAuthenticated(this);
  }

  edit(i: string) {
    const dialogRef = this.dialog.open(AdminActionDialogComponent, {
      width: '650px',
      height: '675px',
      data: this.actions[i]
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
  }

  saveDelete() {
    this.lambdaService.adminDeleteAction(this.selection.selected, this);
    this.isDeleted = true;
  }

   // LoggedInCallback interface
   isLoggedIn(message: string, isLoggedIn: boolean) {
     if (isLoggedIn) {
      this.lambdaService.listActions(this);
     } else {
       // not logged in
       this.cognitoUtil.getCurrentUser().signOut();
     }
   }

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
      if (result.toString().includes('CredentialsError')) {
        // window.location.reload();
        console.log('credentials error, RETRYING');
        this.lambdaService.listActions(this);
    }
    if (this.isDeleted) {
      window.location.reload();
    }
  }
}

callbackWithParam(result: any): void {}
}