import { ActionDialogComponent } from './../action-dialog/action-dialog.component';
import { Component, OnInit, Input, ViewChild, Directive } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Parameters } from '../services/parameters';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, LoggedInCallback {
  actionsLength: number;
  action: Action;
  eligiblePoints: number;
  user: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  observableData: Observable<any>;

  actions: Action[];
  dataSource;

  columnCount: number;
  columnWidth = 200;
  gutterWidth = 10;

  constructor(
    public dialog: MatDialog, public actionService: ActionService,
    public lambdaService: LambdaInvocationService, public params: Parameters,
    public loginService: LogInService, public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
    this.params.user$.subscribe(user => {
      this.user = user;
      this.user.totalPoints = user.totalPoints;
    });

    this.lambdaService.listActions(this);
    // to get the user data that's diplayed across the top
    this.loginService.isAuthenticated(this);

    this.columnCount = window.innerWidth / (this.columnWidth + this.gutterWidth);
  }

  onResize(event) {
    this.columnCount = event.target.innerWidth / (this.columnWidth + this.gutterWidth);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // make it so the user is only searching for an action name
    const actionNames = [];
  /** attempt at filtering by action name only so other data elements are not filtered on
    for (let i = 0; i < this.actions.length; i ++) {
      actionNames.push(this.actions[i].name);
    }
    // does this mess up the rendering on the UI?
    this.dataSource = actionNames;
    console.log('actoin names ' + JSON.stringify(actionNames)); **/
    this.dataSource.filter = filterValue;
  }

  openDialog(name: string, action: Action) {
   // required for page render
    this.actionService.openDialog(name, action);
   // this.action = this.getActionsData(name);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // response of lambda list Actions API call
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.actions = response.body;
      this.dataSource = new MatTableDataSource(this.actions);
      this.dataSource.paginator = this.paginator;
      this.observableData = this.dataSource.connect();
    } else {
      window.location.reload();
    }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    const params = new Parameters();
    this.user = params.buildUser(result, cognitoUser);
  }
}
