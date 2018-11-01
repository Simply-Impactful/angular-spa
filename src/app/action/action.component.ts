import { Component, OnInit, Input, INJECTOR, Inject } from '@angular/core';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { BehaviorSubject } from 'rxjs';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LoggedInCallback } from '../services/cognito.service';
import { Parameters } from 'src/app/services/parameters';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, LoggedInCallback {

  actions: Action[];
  actionsLength: number;
  assignment: any;

  constructor(public actionService: ActionService, public lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    this.lambdaService.listActions(this);
  }

  openDialog(name: string, action: Action) {
    this.actionService.openDialog(name, action);
  }
  isLoggedIn(message: string, loggedIn: boolean): void {}

  // Result is response of listActions API lambda call
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      // console.log('result in action ' + result);
      const response = JSON.parse(result);
      this.actions = response.body;
      this.actionsLength = response.body.length;
      // display the first three in the list.. need to make it most common 3?
      for ( let i = this.actionsLength; i > 3; i -- ) {
        this.actions.pop();
      }
    } else {
      // credentials error likely occurred.. retry if so
      if (error.toString().includes('credentials')) {
        console.log('my groups credentials error.. RETRYING ' + JSON.stringify(error));
        this.lambdaService.listActions(this);
      }
    }
  }
  callbackWithParam(result: any): void {}
}
