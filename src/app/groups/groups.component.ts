

import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import {MatPaginator, MatTableDataSource} from '@angular/material';


export interface UserData {
  name: string;
  description: string;
  username: string;
  email: string;
  zipcode: number;
  carbon: string;
}

const USER_DATA: UserData[] = [
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'},
  {name: 'Sarah', description: 'Rain or Sign', username: 'Sarah1', email: 'sarah@gmail.com', zipcode: 12345, carbon: '3 lbs'}
];

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit {

  displayedColumns = ['name', 'description', 'username', 'email', 'zipcode', 'carbon'];
  dataSource = new MatTableDataSource(USER_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
    this.dataSource.paginator = this.paginator;
  }
}

export interface Member {
  name: string;
  points: number;
}

export const groupMembers: Member[] = [
  {
    'name': 'Paul',
    'points': 20
  },
  {
    'name': 'Tom',
    'points': 10
  }
];
