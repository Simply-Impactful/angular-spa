import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { User } from '../model/User';
import { AWSError } from 'aws-sdk';
import * as _ from 'lodash';
import { LogInService } from '../services/log-in.service';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-admin-access-users',
  templateUrl: './admin-access-users.component.html',
  styleUrls: ['./admin-access-users.component.scss']
})

export class AdminAccessUsersComponent implements OnInit, LoggedInCallback {
  users: User[];
  displayedColumns = ['username', 'first name', 'last name', 'email', 'zipcode', 'carbon', 'totalpoints'];
  dataSource: any;
  data: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent,
    public lambdaService: LambdaInvocationService,
    public loginService: LogInService,
    public cognitoUtil: CognitoUtil,
    public excelService: ExcelService) { }

  ngOnInit() {
    this.appComp.setAdmin();
    this.loginService.isAuthenticated(this);
    // response in callbackWithParams
    this.lambdaService.listUserActions(this);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // result of lambda listUserActions API
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      // filter results by username as the API returns all user actions by every user
      const unique = _.uniqBy(response.body, 'username');
      this.users = unique;
      // set the data of the excel output
      // TODO: should this be non-unique?
      this.data = this.users;
      for (let i = 0; i < this.users.length; i++) {
        if (!this.users[i].totalCarbonPoints) {
          this.users[i].totalCarbonPoints = 0;
        }
      }
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.listUsers(this.users);
     } else {
      this.lambdaService.listUserActions(this);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  listUsers(users: User[]) {
    // calls the cognito Util to get all of the cognito users
    this.cognitoUtil.listUsers().then(response => {
      this.getAttributesForUsers(users, response);
    });
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'sample');
  }

  getAttributesForUsers(users: User[], cognitoResponse: any[]): void {
    // cross-check the cognito users and map the data for each member of the group passed in
    cognitoResponse.map((cognitoUsers) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === cognitoUsers.Username) {
          for (let j = 0; j < cognitoUsers.Attributes.length; j++) {
          // Going one by one, capture the first and last name of the cognito users
          // and build it out in the users object array being displayed in the table
            if (cognitoUsers.Attributes[j]['Name'] === 'name') {
              users[i].name = cognitoUsers.Attributes[j]['Value'];
            }
            if (cognitoUsers.Attributes[j]['Name'] === 'custom:lastName') {
              users[i].lastName = cognitoUsers.Attributes[j]['Value'];
            }
          }
        }
      }
    });
  }

  callbackWithParam(result: any): void {}
}


