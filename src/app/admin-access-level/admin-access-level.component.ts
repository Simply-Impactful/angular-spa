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
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';

@Component({
  selector: 'app-admin-access-level',
  templateUrl: './admin-access-level.component.html',
  styleUrls: ['./admin-access-level.component.scss']
})
export class AdminAccessLevelComponent implements OnInit {
  conf = AppConf;
//  levels: Levels[];
  displayedColumns = ['pointsRange', 'status', 'statusGraphicUrl'];
  dataSource;
  inputText;
  editField: string;
  statusGraphicUrl: any;
  awaitingLevelList: Array<any> = [];
  imageFiles: any = {};
  isViewing: boolean = true;
  isAdding: boolean = false;
  addingLevels = [];
  levelsObj = new Levels;

  levels: Array<any> = [
    { id: 1, pointsRange: '0 - 250',  status: 'Grasshopper',
    statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/grasshopperforapp.png' },
    { id: 2, pointsRange: '251 - 750',  status: 'Bee',
    statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/beeforapp.png' },
    { id: 3, pointsRange: '751 - 1750',  status: 'Koala',
    statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/koalaforapp.png' },
    { id: 2, pointsRange: '1751 - 3250',  status: 'Octopus',
    statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/octopus.png' },
    { id: 1, pointsRange: '3252 - 5250',  status: 'Owl',
    statusGraphicUrl: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/owlforapp.png' }
  ];

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService,
    private s3: S3Service) {}

  ngOnInit() {
    this.appComp.setAdmin();
   // this.lambdaService.listLevelData(this);
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
      window.location.reload();
    }
  }
  callbackWithParam(result: any): void {}

  saveNew() {
    if (this.statusGraphicUrl) {
      this.s3.uploadFile(this.statusGraphicUrl, this.conf.imgFolders.actions, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.log(err);
          this.levelsObj.statusGraphicUrl = this.conf.default.groupAvatar;
          this.levels.push(this.levelsObj);
          this.lambdaService.createLevelData(this.levels, this);
        } else {
            this.levelsObj.statusGraphicUrl = location;
            this.levels.push(this.levelsObj);
            // response goes to cognitoCallback
            this.lambdaService.createLevelData(this.levels, this);
        }
      });
    }
  }

  cognitoCallback(message: string, result: any) {
    if (result) {
      console.log('result of create level ' + result);
      this.addingLevels.pop();
    } else {
      console.log('error ' + message);
    }
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.levels[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingLevelList.push(this.levels[id]);
    this.levels.splice(id, 1);
  }

  add() {
  //    const level = this.awaitingLevelList[0];
      this.addingLevels.push(null);
      this.awaitingLevelList.splice(0, 1);
  }

  changeValue(property: string, event: any) {
    this.editField = event.target.textContent;
    if (property === 'pointsRange') {
      this.levelsObj.pointsRange = this.editField;
    }
    if (property === 'status') {
      this.levelsObj.status = this.editField;
    }
  }

  // storing as single variables instead of an array for now...
  fileEvent(fileInput: any, imageName: string) {
    this[imageName] = fileInput.target.files[0];
  }
}
