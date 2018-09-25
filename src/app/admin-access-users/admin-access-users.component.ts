import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';


export interface UserData {
  name: string;
  username: string;
  email: string;
  zipcode: number;
  actionstaken: string;
  totalpoints: number;
}

const USER_DATA: UserData[] = [
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},
  {name: 'Sarah', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, actionstaken: 'walked to school', totalpoints: 10},

];

@Component({
  selector: 'app-admin-access-users',
  templateUrl: './admin-access-users.component.html',
  styleUrls: ['./admin-access-users.component.scss']
})

export class AdminAccessUsersComponent implements OnInit {

  displayedColumns = ['name', 'username', 'email', 'zipcode', 'actionstaken', 'totalpoints'];
  dataSource = new MatTableDataSource(USER_DATA);

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }
}


