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
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {
  displayedColumns = ['pointsRange', 'status', 'statusGraphicUrl'];
  dataSource;

  constructor( public appComp: AppComponent, public lambdaService: LambdaInvocationService) { }

    ngOnInit() {
      const levels: Array<any> = [
        { id: 1, pointsRange: '0 - 250',  status: 'Grasshopper',
        statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/grasshopperforapp.png' },
        { id: 2, pointsRange: '251 - 750',  status: 'Bee',
        statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/beeforapp.png' },
        { id: 3, pointsRange: '751 - 1750',  status: 'Koala',
        statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/koalaforapp.png' },
        { id: 4, pointsRange: '1751 - 3250',  status: 'Octopus',
        statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/octopus.png' },
        { id: 5, pointsRange: '3252 - 5250',  status: 'Owl',
        statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/owlforapp.png' }
      ];
    //  this.lambdaService.listLevelData(this);
    this.dataSource = new MatTableDataSource(levels);
    }
  isLoggedIn(message: string, loggedIn: boolean): void {}
/**    callbackWithParams(error: AWSError, result: any): void {
      if (result) {
        const response = JSON.parse(result);
        this.levels = response.body;
        console.log('response.body', response.body);
        this.dataSource = new MatTableDataSource(this.levels);
       } else {
        console.log('error pulling the levels data' + error);
      }
    } **/
    callbackWithParam(result: any): void {}
  }
