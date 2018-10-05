import { User } from './../model/User';
import { Action } from './../model/Action';
import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupsComponent implements OnInit, LoggedInCallback {
  constructor(
    public lambdaService: LambdaInvocationService) { }

  dataSource;
  columnsToDisplay = ['name', 'eligblePoints', 'funFact', 'maxFrequency'];
  expandedElement;

  username: string = '';
  userscore;
  unplugPoints;
  faucetPoints;
  lightsPoints;
  dialogResult = '';
  actionsLength: number;
  groups: Action[];
  eligiblePoints: number;
  user: User;
 // @Input() user: User;


  ngOnInit() {
   this.lambdaService.listActions(this);
  }
  isLoggedIn(message: string, loggedIn: boolean): void {
  }

  // response of lamdba list Actions API call
  callbackWithParams(error: AWSError, result: any): void {
    const response = JSON.parse(result);
    this.groups = response.body;
    this.dataSource = this.groups;
  }
  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {

  }

}
