import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { LoggedInCallback } from '../services/cognito.service';
import { User } from '../model/User';
import { AWSError } from 'aws-sdk';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-access-users',
  templateUrl: './admin-access-users.component.html',
  styleUrls: ['./admin-access-users.component.scss']
})

export class AdminAccessUsersComponent implements OnInit, LoggedInCallback {
  users: User[];
  displayedColumns = ['username', 'email', 'zipcode', 'carbon', 'totalpoints'];
  dataSource;
  distinct = new Array<User>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    this.appComp.setAdmin();
  this.lambdaService.listUsers(this);  }

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
      this.dataSource.paginator = this.paginator;
      console.log('this.users ' + JSON.stringify(this.users));

     } else {
      console.log('error pulling the Users data' + error);
    }
  }
  callbackWithParam(result: any): void {}
}


