import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {MatPaginator, MatTableDataSource} from '@angular/material';


import * as _ from 'lodash';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {

  users: User[];
  displayedColumns = ['username', 'email', 'zipcode'];
  dataSource;
  distinct = new Array<User>();

  constructor( public appComp: AppComponent, public lambdaService: LambdaInvocationService) { }

    ngOnInit() {
      this.lambdaService.listUsers(this);
    }
  isLoggedIn(message: string, loggedIn: boolean): void {}
  // result of lambda listActions and Delete Actions API
    callbackWithParams(error: AWSError, result: any): void {
      if (result) {
        const response = JSON.parse(result);
        const unique = _.uniqBy(response.body, 'username');
        this.users = unique;
        for (let i = 0; i < this.users.length; i++) {
          if (!this.users[i].totalCarbonPoints) {
            this.users[i].totalCarbonPoints = 0;
          }
        }
        this.dataSource = new MatTableDataSource(this.users);
      //  console.log('this.users ' + JSON.stringify(this.users));
       } else {
        console.log('error pulling the Users data' + error);
      }
    }
    callbackWithParam(result: any): void {}
  }
