import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Levels } from '../model/Levels';
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
  selector: 'app-admin-access-level',
  templateUrl: './admin-access-level.component.html',
  styleUrls: ['./admin-access-level.component.scss']
})
export class AdminAccessLevelComponent implements OnInit {

  levels: Levels[];
  displayedColumns = ['pointsRange', 'status', 'statusGraphicUrl'];
  dataSource;

  inputText;
  editField: string;
  // levelList: Array<any> = [
  //  { id: 1, pointsRange: '0 - 100',  status: 'Elephant',
  //  statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/elephant2.svg' },
  //  { id: 2, pointsRange: '100 - 200',  status: 'Lemur',
  //  statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/lemur.svg' },
  // ];

  awaitingLevelList: Array<any> = [];

  constructor( public appComp: AppComponent, public lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    this.lambdaService.listLevelData(this);
  }

isLoggedIn(message: string, loggedIn: boolean): void {}
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.levels = response.body;
      console.log('response.body', response.body);
      this.dataSource = new MatTableDataSource(this.levels);
     } else {
      console.log('error pulling the levels data' + error);
    }
  }
  callbackWithParam(result: any): void {}


  saveNew() {}

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.levels[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingLevelList.push(this.levels[id]);
    this.levels.splice(id, 1);
  }

  add() {
      const level = this.awaitingLevelList[0];
      this.levels.push(level);
      this.awaitingLevelList.splice(0, 1);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }
}
