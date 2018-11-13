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

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {
  levels: Levels[];
  displayedColumns = ['pointsRange', 'status', 'statusGraphicUrl', 'description'];
  dataSource;

  constructor( public appComp: AppComponent, public lambdaService: LambdaInvocationService) { }

    ngOnInit() {
    this.lambdaService.listLevelData(this);
    this.dataSource = new MatTableDataSource(this.levels);
    }
  isLoggedIn(message: string, loggedIn: boolean): void {}
    callbackWithParams(error: AWSError, result: any): void {
      if (result) {
        const response = JSON.parse(result);
        this.levels = response.body;
        console.log('response.body', response.body);
        const ascending = this.levels.sort((a, b) => Number(a.min) - Number(b.min));
        this.dataSource = new MatTableDataSource(ascending);
       } else {
        console.log('error pulling the levels data: ' + error);
        if (error.toString().includes('credentials')) {
          // retry
          this.lambdaService.listLevelData(this);
        }
      }
    }
    callbackWithParam(result: any): void {}
  }
