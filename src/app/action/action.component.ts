import { Component, OnInit, Input, INJECTOR, Inject } from '@angular/core';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { BehaviorSubject } from 'rxjs';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LoggedInCallback } from '../services/cognito.service';
import { Parameters } from 'src/app/services/parameters';
import { LogInService } from '../services/log-in.service';
import { ActionConfirmDialogComponent } from '../action-confirm-dialog/action-confirm-dialog.component';
import { MatTableDataSource, MatPaginator, MatButton, MatCheckbox, MatDialog , MatDialogConfig} from '@angular/material';
import { ApiGatewayService } from '../services/api-gateway.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, LoggedInCallback {

  actions: Action[];
  actionsLength: number;
  assignment: any;

  constructor(public actionService: ActionService,
    public dialog: MatDialog,
    public lambdaService: LambdaInvocationService,
    public loginService: LogInService,
    public apiService: ApiGatewayService) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
  }

  openDialog(name: string, action: Action) {
    this.actionService.openDialog(name, action);
    /*const dialogRef = this.dialog.open(ActionConfirmDialogComponent,{
      width: '600px',
      data: action
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(`Dialog closed: ${data}`);
      const result = data
      if (result == 'Log Action') {
      this.actionService.openDialog(name, action);
      }

    }); */
  }

  // Response of 'isAuthenticated' in ngOnInit
  isLoggedIn(message: string, loggedIn: boolean): void {
    if (loggedIn) {
      // don't request lambda data until we are logged in
      this.apiService.listActions(this);
    }
  }

  // Result is response of listActions API lambda call
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      // console.log('result in action ' + result);
      // const response = JSON.parse(result);
      this.actions = result;
      this.actionsLength = result.length;
      // display the first three in the list.. need to make it most common 3?
      for ( let i = this.actionsLength; i > 3; i -- ) {
        this.actions.pop();
      }
    } else {
      // credentials error likely occurred.. retry if so
      if (error.toString().includes('credentials')) {
        this.apiService.listActions(this);
      }
    }
  }
  callbackWithParam(result: any): void {}
}
