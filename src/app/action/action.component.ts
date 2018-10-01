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

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, LoggedInCallback {

  name: string = '';
  actions: Action[];
//  action: Action;
  actionsLength: number;
  user: User;
 //  @Input() user: User;

  constructor(public actionService: ActionService,
    public params: Parameters, public lambdaService: LambdaInvocationService,
    public loginService: LogInService) { }

  ngOnInit() {
    this.lambdaService.listActions(this);
  }

  openDialog(name: string, action: Action) {
    this.actionService.openDialog(name, action);
  }
  isLoggedIn(message: string, loggedIn: boolean): void {

    // throw new Error('Method not implemented.');
   }
   callbackWithParams(error: AWSError, result: any): void {
     const response = JSON.parse(result);
     this.actions = response.body;
     this.actionsLength = response.body.length;
     // display the first three in the list.. need to make it most common 3?
     for ( let i = this.actionsLength; i > 3; i -- ) {
      this.actions.pop();
     }
    }
    callbackWithParam(result: any): void {
    }
  }
